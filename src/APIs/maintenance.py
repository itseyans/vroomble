from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Car, MaintenanceLog, PartChange
from schemas import CarCreate, MaintenanceLogCreate, PartChangeCreate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/car/", response_model=CarCreate)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    db_car = Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@app.get("/car/{car_id}")
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@app.post("/maintenance_log/", response_model=MaintenanceLogCreate)
def create_maintenance_log(log: MaintenanceLogCreate, db: Session = Depends(get_db)):
    db_log = MaintenanceLog(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/maintenance_log/{car_id}")
def get_maintenance_logs(car_id: int, db: Session = Depends(get_db)):
    logs = db.query(MaintenanceLog).filter(MaintenanceLog.car_id == car_id).all()
    return logs

@app.post("/part_change/", response_model=PartChangeCreate)
def add_part_change(change: PartChangeCreate, db: Session = Depends(get_db)):
    db_change = PartChange(**change.dict())
    db.add(db_change)
    db.commit()
    db.refresh(db_change)
    return db_change

@app.get("/part_change/{car_id}")
def get_part_changes(car_id: int, db: Session = Depends(get_db)):
    changes = db.query(PartChange).filter(PartChange.car_id == car_id).all()
    return changes
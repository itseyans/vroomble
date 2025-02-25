from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import date
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./maintenance.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True)
    car_model = Column(String, index=True)
    part = Column(String)
    cost = Column(Float)
    date = Column(Date)
    image_url = Column(String, nullable=True)

# Pydantic Schema
class MaintenanceLogCreate(BaseModel):
    car_model: str
    part: str
    cost: float
    date: date
    image_url: str | None = None

# Initialize DB
Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/logs/", response_model=MaintenanceLogCreate)
def create_log(log: MaintenanceLogCreate, db: Session = Depends(get_db)):
    db_log = MaintenanceLog(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/logs/")
def get_logs(db: Session = Depends(get_db)):
    return db.query(MaintenanceLog).all()

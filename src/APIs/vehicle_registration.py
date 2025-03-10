import logging
import sqlitecloud
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from datetime import datetime

app = FastAPI()

# ✅ SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey=9IwJf2Fz9xSDaQBetYibFbLhi7HrKlAEobNy9wjio9o"

# ✅ Establish Connection & Check Tables
try:
    with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
        print("✅ Connected to SQLite Cloud database!")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Existing Tables:", tables)
except sqlitecloud.Error as e:
    print(f"❌ SQLite Cloud connection error: {e}")

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React App URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Logging Configuration
logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ✅ Car Model Schema
class Car(BaseModel):
    make: str
    model: str
    body_type: str
    variant: str = "N/A"
    transmission: str
    drivetrain: str
    fuel_type: str
    year: int
    retail_srp: float

    @field_validator("year")
    @classmethod
    def validate_year(cls, v):
        if v < 1886 or v > datetime.now().year + 1:
            raise ValueError("Invalid year")
        return v

    @field_validator("retail_srp")
    @classmethod
    def validate_retail_srp(cls, v):
        if v <= 0:
            raise ValueError("Retail SRP must be positive")
        return v

# ✅ Create `cars` Table if Not Exists
def create_table_if_not_exists():
    """Ensures the 'cars' table exists in SQLite Cloud."""
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS cars (
                    CarID INTEGER PRIMARY KEY AUTOINCREMENT,
                    Make TEXT NOT NULL,
                    Model TEXT NOT NULL,
                    Body_Type TEXT NOT NULL,
                    Variant TEXT DEFAULT 'N/A',
                    Transmission TEXT NOT NULL,
                    Drivetrain TEXT NOT NULL,
                    Fuel_Type TEXT NOT NULL,
                    Year INTEGER NOT NULL,
                    Retail_SRP FLOAT NOT NULL CHECK(Retail_SRP > 0)
                )
                """
            )
            conn.commit()
            logger.info("✅ SQLite Cloud Database table 'cars' initialized.")
    except sqlitecloud.Error as e:
        logger.error(f"❌ Error initializing SQLite Cloud database table: {e}")
        raise HTTPException(status_code=500, detail=f"SQLite Cloud error: {e}")

# ✅ Ensure Table Exists on Startup
create_table_if_not_exists()

# ✅ API Endpoint to Fetch All Cars (For Dropdown + Search)
@app.get("/api/vehicles")
async def get_vehicles(q: str = None):
    """Fetches all vehicles from the 'cars' table, with optional search including Year."""
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            if q:
                cursor.execute(
                    """
                    SELECT CarID, Make, Model, COALESCE(Variant, 'N/A'), COALESCE(Drivetrain, 'Unknown'), Year
                    FROM cars
                    WHERE Make LIKE ? OR Model LIKE ? OR Variant LIKE ? OR Drivetrain LIKE ? OR CAST(Year AS TEXT) LIKE ?
                    """,
                    (f"%{q}%", f"%{q}%", f"%{q}%", f"%{q}%", f"%{q}%"),
                )
            else:
                cursor.execute(
                    "SELECT CarID, Make, Model, COALESCE(Variant, 'N/A'), COALESCE(Drivetrain, 'Unknown'), Year FROM cars"
                )

            results = cursor.fetchall()
            return [
                {
                    "carID": row[0],
                    "make": row[1],
                    "model": row[2],
                    "variant": row[3],
                    "drivetrain": row[4],
                    "year": row[5],
                }
                for row in results
            ]
    except sqlitecloud.Error as e:
        logger.error(f"❌ Error fetching vehicles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ✅ API Endpoint to Add a New Car
@app.post("/cars/form/")
async def create_car_form(car_data: Car):
    """Adds a new car to the database."""
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO cars (Make, Model, Body_Type, Transmission, Drivetrain, Fuel_Type, Year, Retail_SRP, Variant)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    car_data.make,
                    car_data.model,
                    car_data.body_type,
                    car_data.transmission,
                    car_data.drivetrain,
                    car_data.fuel_type,
                    car_data.year,
                    car_data.retail_srp,
                    car_data.variant,
                ),
            )
            conn.commit()
            logger.info(f"✅ Car added successfully: {car_data}")
            return {"message": "Car model saved successfully to SQLite Cloud"}

    except sqlitecloud.Error as e:
        logger.error(f"❌ SQLite Cloud database error during car creation: {e}")
        raise HTTPException(status_code=500, detail=f"SQLite Cloud database error: {e}")

# ✅ API Endpoint to Provide Dropdown Options
@app.get("/dropdown_options/")
async def get_dropdown_options():
    """Returns dropdown options (same as before)."""
    return JSONResponse(
        content={
            "makes": [
                "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "BAIC", "Bentley", "BMW",
                "BYD", "Changan", "Chery", "Chevrolet", "Chrysler", "Citroën", "Daewoo",
                "Daihatsu", "Dodge", "Dongfeng", "Ferrari", "Fiat", "Ford", "Foton", "GAC",
                "Geely", "Great Wall", "Haima", "Haval", "Hino", "Honda", "Hyundai", "Isuzu",
                "Jaguar", "Jeep", "JMC", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lotus",
                "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi",
                "Nissan", "Peugeot", "Porsche", "RAM", "Renault", "Rolls-Royce", "SsangYong",
                "Subaru", "Suzuki", "Tata", "Toyota", "Volkswagen", "Volvo",
            ],
            "body_types": [
                "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Fastback",
                "SUV", "Crossover", "Pickup Truck", "Off-Road Vehicle", "Van", "Minivan (MPV)",
                "Supercar", "Roadster", "Muscle Car", "Luxury Car",
                "Pickup-Based SUV", "Microcar / Kei Car", "Panel Van", "Box Truck / Lorry",
                "Bus / Coach", "Flatbed Truck", "Chassis Cab", "Motorcycle",
            ],
            "transmissions": ["Automatic", "Manual", "CVT"],
            "drivetrains": ["FWD", "RWD", "AWD", "4WD"],
            "fuel_types": ["Unleaded", "Diesel", "Electric", "Hybrid"],
        }
    )

# ✅ Root Endpoint
@app.get("/")
async def root():
    return {"message": "🚗 Vehicle Registration API is running"}

# ✅ Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"❌ Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": str(exc)},
    )
import logging
import os
import sqlite3
from typing import Union
from datetime import datetime

from fastapi import FastAPI, Form, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator

app = FastAPI()

# Database file path
db_file = os.path.join(".", "car_database.db")  # Relative path for simplicity

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    filename="app.log",  # Log file name
    level=logging.DEBUG,  # Log level
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Custom exception classes for more specific error handling
class CarAlreadyExistsError(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(status_code=400, detail=detail or "An identical car entry already exists in the database.")

class DatabaseError(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(status_code=500, detail=detail or "Database error.")


# Updated Car model with validation
class Car(BaseModel):
    make: str
    model: str
    body_type: str
    variant: str = "N/A"
    transmission: str
    drivetrain: str
    fuel_type: str
    year: int
    retail_srp: float  # Changed to float type

    @validator('year')
    def validate_year(cls, v):
        if v < 1886 or v > datetime.now().year + 1:
            raise ValueError('Invalid year')
        return v

    @validator('retail_srp')
    def validate_retail_srp(cls, v):
        if v <= 0:
            raise ValueError('Retail SRP must be positive')
        return v


def create_table_if_not_exists(db_file):
    """Creates the cars table if it doesn't exist."""
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("PRAGMA user_version = 1")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cars (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Make TEXT,
                Model TEXT,
                Body_Type TEXT,
                Variant TEXT,
                Transmission TEXT,
                Drivetrain TEXT,
                Fuel_Type TEXT,
                Year INTEGER,
                Retail_SRP FLOAT
            )
        ''')
        conn.commit()
        logger.info("Database table created or already exists.")
        conn.close()
    except sqlite3.Error as e:
        logger.error(f"Error creating table: {e}")
        raise DatabaseError(detail=f"Error creating table: {e}")


create_table_if_not_exists(db_file)


# Modified endpoint to accept JSON
@app.post("/cars/form/")
async def create_car_form(
    car_data: Car  # Receive as JSON body instead of form-data
):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        # Convert SRP to string with 2 decimal places for storage
        srp_str = f"{car_data.retail_srp:.2f}"

        cursor.execute('''
            INSERT INTO cars (Make, Model, Body_Type, Transmission, Drivetrain, Fuel_Type, Year, Retail_SRP, Variant)
            VALUES (?,?,?,?,?,?,?,?,?)
        ''', (
            car_data.make, car_data.model, car_data.body_type,
            car_data.transmission, car_data.drivetrain, car_data.fuel_type,
            car_data.year, srp_str, car_data.variant
        ))

        conn.commit()
        logger.info(f"Car added: {car_data}")
        return {"message": "Car model saved successfully"}

    except sqlite3.IntegrityError:
        raise CarAlreadyExistsError()
    except sqlite3.Error as e:
        logger.error(f"Database error: {e}")
        raise DatabaseError(detail=f"Error saving to database: {e}")

@app.get("/")
async def root():
    return {"message": "Vehicle registration API"}

@app.get("/dropdown_options/")
async def get_dropdown_options():
    """Returns the available options for dropdown menus."""
    return {
        "makes": ["Abarth", "Alfa Romeo", "Aston Martin", "Audi", "BAIC", "Bentley", "BMW",
  "BYD", "Changan", "Chery", "Chevrolet", "Chrysler", "Citroën", "Daewoo",
  "Daihatsu", "Dodge", "Dongfeng", "Ferrari", "Fiat", "Ford", "Foton", "GAC",
  "Geely", "Great Wall", "Haima", "Haval", "Hino", "Honda", "Hyundai", "Isuzu",
  "Jaguar", "Jeep", "JMC", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lotus",
  "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi",
  "Nissan", "Peugeot", "Porsche", "RAM", "Renault", "Rolls-Royce", "SsangYong",
  "Subaru", "Suzuki", "Tata", "Toyota", "Volkswagen", "Volvo"],
        "body_types": [
            "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Fastback",
            "SUV", "Crossover", "Pickup Truck", "Off-Road Vehicle", "Van", "Minivan (MPV)",
            "Supercar", "Roadster", "Muscle Car", "Luxury Car",
            "Pickup-Based SUV", "Microcar / Kei Car", "Panel Van", "Box Truck / Lorry",
            "Bus / Coach", "Flatbed Truck", "Chassis Cab", "Motorcycle"
        ],
        "transmissions": ["Automatic", "Manual", "CVT"],
        "drivetrains": ["FWD", "RWD", "AWD", "4WD"],
        "fuel_types": ["Unleaded", "Diesel", "Electric", "Hybrid"],
    }

# Exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": str(exc)}  # Ensure JSON response
    )

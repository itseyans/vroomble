import logging
import os
import sqlite3  # Keep this for potential exception handling, but not for cloud connection
import sqlitecloud  # Ensure this is installed: pip install sqlitecloud

from typing import Union
from datetime import datetime
from fastapi.responses import JSONResponse

from fastapi import FastAPI, Form, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

app = FastAPI()

# Cloud Database Connection (No local file path needed)
# IMPORTANT: Replace 'YOUR_ACTUAL_API_KEY' with the API Key from your Connection Details!
DATABASE_URL = "sqlitecloud://ctaovn0pnk.g5.sqlite.cloud:8860/vehicle_database.db?apikey=oXMlbWtTpbPERtuXHA4t4FALgGaUTNELNjL2U0HlMzU"

# Initial connection attempt - you can keep this for early verification, but connections are also made in functions
# try:
#     conn = sqlitecloud.connect(DATABASE_URL)
#     print("✅ Successfully connected to SQLite Cloud database!")
#     conn.close() # Close immediately after verification, connections are managed in functions
# except sqlitecloud.Error as e:
#     print(f"❌ Error connecting to SQLite Cloud database: {e}")
#     # It's better to handle connection within functions to manage resources effectively


# CORS middleware (same as before)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging (same as before)
logging.basicConfig(
    filename="app.log",  # Log file name
    level=logging.DEBUG,  # Log level
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Custom exception classes (same as before)
class CarAlreadyExistsError(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(
            status_code=400,
            detail=detail or "An identical car entry already exists in the database.",
        )

class DatabaseError(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(
            status_code=500, detail=detail or "Database error."
        )

# Car model (same as before)
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

def create_table_if_not_exists():
    """Ensures the database table exists in SQLite Cloud."""
    try:
        # ✅ Connect to SQLite Cloud database (using DATABASE_URL)
        with sqlitecloud.connect(DATABASE_URL) as conn: # Use context manager for connection
            cursor = conn.cursor()

            # ✅ Enable foreign keys (optional but good practice - check SQLite Cloud docs if needed)
            # cursor.execute("PRAGMA foreign_keys = ON") # Commented out - might not be needed in cloud

            # ✅ Create the table if it doesn't exist
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS cars (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
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
            logger.info(
                "SQLite Cloud Database table 'cars' created successfully (if not already existing)."
            )
            print("✅ SQLite Cloud Database table 'cars' initialized!")  # Debugging output

    except sqlitecloud.Error as e:  # Catch sqlitecloud.Error
        logger.error(f"Error initializing SQLite Cloud database table: {e}")
        raise DatabaseError(
            detail=f"SQLite Cloud database table initialization error: {e}"
        )

# ✅ Call function on startup to ensure table exists (optional, depending on your workflow)
create_table_if_not_exists()

# --- submit_form endpoint (same as before) ---
@app.post("/submit_form/")
async def submit_form(car_data: Car):  # Expect Car model for validation
    """
    Endpoint to receive and validate car form data.
    If data is valid, it saves it to the SQLite Cloud database.
    """
    print("Received Data for Validation:", car_data)  # Logging received data
    return await create_car_form(car_data)  # Call create_car_form to save

# --- cars/form endpoint for database saving ---
@app.post("/cars/form/")
async def create_car_form(car_data: Car):
    logger.info("Entering create_car_form function...")  # Log entry

    try:
        # ✅ Connect to SQLite Cloud database (using DATABASE_URL) - Use context manager
        with sqlitecloud.connect(DATABASE_URL) as conn:
            cursor = conn.cursor()
            srp_str = f"{car_data.retail_srp:.2f}"

            sql_query = """
                INSERT INTO cars (Make, Model, Body_Type, Transmission, Drivetrain, Fuel_Type, Year, Retail_SRP, Variant)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            values = (
                car_data.make,
                car_data.model,
                car_data.body_type,
                car_data.transmission,
                car_data.drivetrain,
                car_data.fuel_type,
                car_data.year,
                srp_str,
                car_data.variant,
            )

            # Log the query before execution (updated log message)
            logger.info(
                f"Executing SQL on SQLite Cloud: {sql_query} with values {values}"
            )
            cursor.execute(sql_query, values)
            conn.commit() # Commit within the context manager

        logger.info(f"Car added successfully to SQLite Cloud: {car_data}") # Updated log message
        return {"message": "Car model saved successfully to SQLite Cloud"} # Updated message

    except sqlitecloud.Error as e:  # Catch sqlitecloud.Error
        logger.error(f"SQLite Cloud database error during car creation: {e}") # Updated log message
        return JSONResponse(
            status_code=500,
            content={"error": f"SQLite Cloud database error: {e}"}, # Updated error message
        )

# ---  Other endpoints (dropdown_options, root, exception handlers) remain the same ---
@app.get("/")
async def root():
    return {"message": "Vehicle registration API"}

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

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
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
        content={"error": str(exc)},  # Ensure JSON response
    )
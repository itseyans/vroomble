import logging
import os
import sqlite3
from typing import Union
from datetime import datetime
from fastapi.responses import JSONResponse


from fastapi import FastAPI, Form, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator 
app = FastAPI()

# Database file path
db_file = r"C:\Users\Sobre\OneDrive\Desktop\Vroomble\Vroomble Dataset\vehicle_database.db"
print(f"Database file path: {db_file}")

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
    retail_srp: float  

    @field_validator('year')
    @classmethod
    def validate_year(cls, v):
        if v < 1886 or v > datetime.now().year + 1:
            raise ValueError('Invalid year')
        return v

    @field_validator('retail_srp')
    @classmethod
    def validate_retail_srp(cls, v):
        if v <= 0:
            raise ValueError('Retail SRP must be positive')
        return v

def create_table_if_not_exists():
    """Ensures the database file and table exist before use."""
    try:
        # ✅ Ensure database file is created
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        # ✅ Enable foreign keys (optional but good practice)
        cursor.execute("PRAGMA foreign_keys = ON")

        # ✅ Create the table if it doesn't exist
        cursor.execute('''
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
        ''')

        conn.commit()
        logger.info("Database and table created successfully (if not already existing).")
        print("✅ Database and table initialized!")  # Debugging output
        conn.close()

    except sqlite3.Error as e:
        logger.error(f"Error initializing database: {e}")
        raise DatabaseError(detail=f"Database initialization error: {e}")

# ✅ Call function on startup
create_table_if_not_exists()

# --- Modified submit_form endpoint for validation ---
@app.post("/submit_form/")
async def submit_form(car_data: Car):  # Expect Car model for validation
    """
    Endpoint to receive and validate car form data.
    If data is valid, it proceeds to save it to the database.
    """
    print("Received Data for Validation:", car_data) # Logging received data

    # If validation passes (FastAPI will automatically validate against the Car model),
    # proceed to save the data.  We can directly call the create_car_form function here.
    return await create_car_form(car_data) # Call create_car_form to save


# --- cars/form endpoint for database saving (keep this as is) ---
@app.post("/cars/form/")
async def create_car_form(car_data: Car):
    logger.info("Entering create_car_form function...")  # ADD THIS LINE

    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        srp_str = f"{car_data.retail_srp:.2f}"

        sql_query = '''
            INSERT INTO cars (Make, Model, Body_Type, Transmission, Drivetrain, Fuel_Type, Year, Retail_SRP, Variant)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        values = (
            car_data.make, car_data.model, car_data.body_type,
            car_data.transmission, car_data.drivetrain, car_data.fuel_type,
            car_data.year, srp_str, car_data.variant
        )

        # Log the query before execution
        logger.info(f"Executing SQL: {sql_query} with values {values}")

        cursor.execute(sql_query, values)
        conn.commit()
        conn.close()

        logger.info(f"Car added successfully: {car_data}")
        return {"message": "Car model saved successfully"}

    except sqlite3.Error as e:
        logger.error(f"Database error: {e}")
        return JSONResponse(status_code=500, content={"error": f"Database error: {e}"})

@app.get("/")
async def root():
    return {"message": "Vehicle registration API"}

@app.get("/dropdown_options/")
async def get_dropdown_options():
    """Returns the available options for dropdown menus."""
    return JSONResponse(content={
        "makes": ["Abarth", "Alfa Romeo", "Aston Martin", "Audi", "BAIC", "Bentley", "BMW",
                  "BYD", "Changan", "Chery", "Chevrolet", "Chrysler", "Citroën", "Daewoo",
                  "Daihatsu", "Dodge", "Dongfeng", "Ferrari", "Fiat", "Ford", "Foton", "GAC",
                  "Geely", "Great Wall", "Haima", "Haval", "Hino", "Honda", "Hyundai", "Isuzu",
                  "Jaguar", "Jeep", "JMC", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lotus",
                  "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi",
                  "Nissan", "Peugeot", "Porsche", "RAM", "Renault", "Rolls-Royce", "SsangYong",
                  "Subaru", "Suzuki", "Tata", "Toyota", "Volkswagen", "Volvo"],
        "body_types": ["Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Fastback",
                       "SUV", "Crossover", "Pickup Truck", "Off-Road Vehicle", "Van", "Minivan (MPV)",
                       "Supercar", "Roadster", "Muscle Car", "Luxury Car",
                       "Pickup-Based SUV", "Microcar / Kei Car", "Panel Van", "Box Truck / Lorry",
                       "Bus / Coach", "Flatbed Truck", "Chassis Cab", "Motorcycle"],
        "transmissions": ["Automatic", "Manual", "CVT"],
        "drivetrains": ["FWD", "RWD", "AWD", "4WD"],
        "fuel_types": ["Unleaded", "Diesel", "Electric", "Hybrid"],
    })

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

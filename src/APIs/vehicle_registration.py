from fastapi import FastAPI, Form, HTTPException
from pydantic import BaseModel
import sqlite3
import os

app = FastAPI()

# Database file path
db_file = os.path.join("C:\\Users\\Sobre\\OneDrive\\Desktop\\Vroomble\\Vroomble Dataset", "car_database.db")  # Replace with your actual path

class Car(BaseModel):
    make: str
    model: str
    body_type: str
    variant: str
    transmission: str
    drivetrain: str
    fuel_type: str
    year: int

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
                Year INTEGER
            )
        ''')
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error creating table: {e}")

create_table_if_not_exists(db_file)

@app.post("/cars/")
async def create_car(car: Car):
    """Saves car data to the database, preventing duplicates."""
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT COUNT(*) FROM cars 
            WHERE Make=? AND Model=? AND Body_Type=? AND Variant=? AND Transmission=? AND Drivetrain=? AND Fuel_Type=? AND Year=?
        ''', (car.make, car.model, car.body_type, car.variant, car.transmission, car.drivetrain, car.fuel_type, car.year))

        existing_entry_count = cursor.fetchone()[0]

        if existing_entry_count > 0:
            raise HTTPException(status_code=400, detail="An identical car entry already exists in the database.")
        else:
            cursor.execute('''
                INSERT INTO cars (Make, Model, Body_Type, Variant, Transmission, Drivetrain, Fuel_Type, Year)
                VALUES (?,?,?,?,?,?,?,?)
            ''', (car.make, car.model, car.body_type, car.variant, car.transmission, car.drivetrain, car.fuel_type, car.year))
            conn.commit()
            conn.close()
            return {"message": "Car model saved successfully"}

    except HTTPException as http_exception:
        raise http_exception
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving to database: {e}")

@app.post("/cars/form/")
async def create_car_form(
    make: str = Form(...),
    model: str = Form(...),
    body_type: str = Form(...),
    variant: str = Form(...),
    transmission: str = Form(...),
    drivetrain: str = Form(...),
    fuel_type: str = Form(...),
    year: int = Form(...)
):
    car_data = Car(
        make=make,
        model=model,
        body_type=body_type,
        variant=variant,
        transmission=transmission,
        drivetrain=drivetrain,
        fuel_type=fuel_type,
        year=year,
    )
    return await create_car(car_data)

@app.get("/dropdown_options/")
async def get_dropdown_options():
    """Returns the available options for dropdown menus."""
    return {
        "makes": ["Toyota", "Mitsubishi", "Honda", "Ford", "Chevrolet"],  # Add more makes as needed
        "body_types": ["SUV", "SEDAN", "UV", "COUPE", "HATCHBACK", "TRUCK", "VAN", "CONVERTIBLE", "WAGON", "MOTORCYCLE"],
        "transmissions": ["Automatic", "Manual", "CVT"],  # Add more transmission types as needed
        "drivetrains": ["FWD", "RWD", "AWD", "4WD"],  # Add more drivetrain options as needed
        "fuel_types": ["Unleaded", "Diesel", "Electric", "Hybrid"],  # Add more fuel types as needed
    }

@app.get("/")
async def root():
    return {"message": "Vehicle registration API"}
from fastapi import FastAPI, HTTPException, Form
from pydantic import BaseModel
import sqlite3
import os

app = FastAPI()

# Database file path
db_file = os.path.join("C:\\Users\\Sobre\\OneDrive\\Desktop\\Vroomble\\Vroomble Dataset", "car_parts_database.db")

# Pydantic model for car part data
class CarPart(BaseModel):
    part_name: str
    model_number: str | None = None  # Optional model number
    category: str
    manufacturer: str
    price: float

# Function to create the car_parts table if it doesn't exist
def create_table_if_not_exists(db_file):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("PRAGMA user_version = 1")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS car_parts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                part_name TEXT NOT NULL,
                model_number TEXT,
                category TEXT,
                manufacturer TEXT,
                price REAL
            )
        ''')
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error creating table: {e}")

create_table_if_not_exists(db_file)

# API endpoint to register a car part
@app.post("/car_parts/")
async def register_car_part(car_part: CarPart):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        # Check for duplicates based on part_name and model_number (if provided)
        if car_part.model_number:
            cursor.execute("SELECT COUNT(*) FROM car_parts WHERE part_name=? AND model_number=?", (car_part.part_name, car_part.model_number))
        else:
            cursor.execute("SELECT COUNT(*) FROM car_parts WHERE part_name=?", (car_part.part_name,))

        existing_entry_count = cursor.fetchone()[0]

        if existing_entry_count > 0:
            raise HTTPException(status_code=400, detail="A car part with that name and model number (or just name) already exists.")
        else:
            # Insert the car part data
            cursor.execute('''
                INSERT INTO car_parts (part_name, model_number, category, manufacturer, price)
                VALUES (?, ?, ?, ?, ?)
            ''', (car_part.part_name, car_part.model_number, car_part.category, car_part.manufacturer, car_part.price))
            conn.commit()
            conn.close()
            return {"message": "Car part registered successfully"}

    except HTTPException as http_exception:
        raise http_exception
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering car part: {e}")

# API endpoint to handle form submission for car part registration
@app.post("/car_parts/form/")
async def register_car_part_form(
    part_name: str = Form(...),
    model_number: str | None = Form(None),  # Optional model number
    category: str = Form(...),
    manufacturer: str = Form(...),
    price: float = Form(...)
):
    car_part_data = CarPart(
        part_name=part_name,
        model_number=model_number,
        category=category,
        manufacturer=manufacturer,
        price=price
    )
    return await register_car_part(car_part_data)

# API endpoint to provide dropdown options for the form
@app.get("/car_parts/dropdown_options/")
async def get_dropdown_options():
    return {
        "categories": ["Sports", "Street", "Offroad", "Wheels"]
    }
from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os

app = FastAPI()

# CORS configuration (Make sure to include this)
origins = [
    "http://localhost:3000",  # Replace with your Next.js frontend URL
    # Add other allowed origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Database file path
db_file = os.path.join("C:\\Users\\Sobre\\OneDrive\\Desktop\\Vroomble\\Vroomble Dataset", "car_parts_database.db")
db_dir = os.path.dirname(db_file)  # get just the path to the directory.

# Pydantic model for car part data (matching the form fields)
class CarPart(BaseModel):
    make: str
    part_name: str
    model_number: str | None = None  # Optional model number
    category: str
    part_origSRP: float  # Assuming this is the original SRP

# Function to create the car_parts table if it doesn't exist
def create_table_if_not_exists(db_file):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("PRAGMA user_version = 1")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS car_parts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                make TEXT,  -- Added 'make' column
                part_name TEXT NOT NULL,
                model_number TEXT,
                category TEXT,
                part_origSRP REAL  -- Added 'part_origSRP' column
            )
        ''')
        conn.commit()
        conn.close()
        print("Table created or already exists.")
    except Exception as e:
        print(f"Error creating table: {e}")

create_table_if_not_exists(db_file)

# API endpoint to register a car part (modified to match form fields)
@app.post("/car_parts/")
async def register_car_part(car_part: CarPart):
    try:
        # Ensure directory exists.
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)

        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        # Check for duplicates **ONLY** based on `model_number` (if provided)
        if car_part.model_number:
            cursor.execute("SELECT COUNT(*) FROM car_parts WHERE model_number=?", (car_part.model_number,))
            existing_entry_count = cursor.fetchone()[0]
            if existing_entry_count > 0:
                raise HTTPException(status_code=400, detail="A car part with this model number already exists.")

        # Insert the car part data
        cursor.execute('''
            INSERT INTO car_parts (make, part_name, model_number, category, part_origSRP)
            VALUES (?, ?, ?, ?, ?)
        ''', (car_part.make, car_part.part_name, car_part.model_number, car_part.category, car_part.part_origSRP))
        conn.commit()
        conn.close()

        return {"message": "Car part registered successfully"}

    except sqlite3.Error as sqlite_err:
        raise HTTPException(status_code=500, detail=f"Database error: {sqlite_err}")
    except HTTPException as http_exception:
        raise http_exception
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering car part: {e}")


# API endpoint to handle form submission (modified to match form fields)
@app.post("/car_parts/form/")
async def register_car_part_form(
    make: str = Form(...),
    part_name: str = Form(...),
    model_number: str | None = Form(None),
    category: str = Form(...),
    part_origSRP: float = Form(...)
):
    car_part_data = CarPart(
        make=make,
        part_name=part_name,
        model_number=model_number,
        category=category,
        part_origSRP=part_origSRP
    )
    return await register_car_part(car_part_data)

# API endpoint to provide dropdown options for the form
@app.get("/car_parts/dropdown_options/")
async def get_dropdown_options():
    return {
        "categories": ["Offroad", "Street", "Maintenance", "Sports", "Wheels", "Exterior", "Interior", "Tires"]
    }

@app.post("http://localhost:3000/vehicle_registration")
async def create_item(data: dict):
    return {"message": "Data received!", "data": data}

@app.get("/")
async def root():
    return {"message": "Welcome to the Car Part Registration API!"}
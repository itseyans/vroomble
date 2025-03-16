from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlitecloud  # Using SQLite Cloud (not local sqlite3)
from dotenv import load_dotenv  # Import load_dotenv
import os

app = FastAPI()

# CORS Configuration (Allow frontend requests from Next.js)
origins = [
    "http://localhost:3000",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Specify the exact path of your .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)
                              
# Fetch API Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")

# Debugging: Print to verify
print("Loaded API Key:", SQLITE_CLOUD_API_KEY)

if not SQLITE_CLOUD_API_KEY:
    raise Exception("API Key not found! Check your .env file and path.")

CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

# Check and Establish Connection
try:
    with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
        print("Successfully connected to SQLite Cloud database!")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Existing Tables:", tables)
except sqlitecloud.Error as e:
    print(f"SQLite Cloud connection error: {e}")

# Pydantic Model for Car Parts
class CarPart(BaseModel):
    make: str
    part_name: str
    model_number: str | None = None  # Optional model number
    category: str
    part_origSRP: float  # Original price

# Function to Ensure `car_parts` Table Exists in SQLite Cloud
def create_table_if_not_exists():
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS car_parts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    make TEXT NOT NULL,
                    part_name TEXT NOT NULL,
                    model_number TEXT UNIQUE,  -- Ensure model_number is unique
                    category TEXT NOT NULL,
                    part_origSRP REAL NOT NULL CHECK(part_origSRP > 0)
                )
            ''')
            conn.commit()
            print("Table 'car_parts' created or already exists.")
    except sqlitecloud.Error as e:
        print(f"Error creating table in SQLite Cloud: {e}")

# Create table if not exists
create_table_if_not_exists()

# API Endpoint to Register a Car Part (POST)
@app.post("/car_parts/")
async def register_car_part(car_part: CarPart):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            # Check if a car part with the same `model_number` already exists
            if car_part.model_number:
                cursor.execute("SELECT COUNT(*) FROM car_parts WHERE model_number=?", (car_part.model_number,))
                existing_entry_count = cursor.fetchone()[0]
                if existing_entry_count > 0:
                    raise HTTPException(status_code=400, detail="A car part with this model number already exists.")

            # Insert car part data
            cursor.execute('''
                INSERT INTO car_parts (make, part_name, model_number, category, part_origSRP)
                VALUES (?, ?, ?, ?, ?)
            ''', (car_part.make, car_part.part_name, car_part.model_number, car_part.category, car_part.part_origSRP))
            
            conn.commit()

        return {"message": "Car part registered successfully!"}

    except sqlitecloud.Error as sqlite_err:
        raise HTTPException(status_code=500, detail=f"Database error: {sqlite_err}")
    except HTTPException as http_exception:
        raise http_exception
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering car part: {e}")

# API Endpoint to Handle Form Submission (POST)
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

# API Endpoint to Provide Dropdown Options
@app.get("/car_parts/dropdown_options/")
async def get_dropdown_options():
    return {
        "categories": ["Offroad", "Street", "Maintenance", "Sports", "Wheels", "Exterior", "Interior", "Tires"]
    }

# API Endpoint to Receive Data from Frontend
@app.post("/vehicle_registration")
async def create_item(data: dict):
    return {"message": "Data received!", "data": data}

# Root Endpoint (Welcome Message)
@app.get("/")
async def root():
    return {"message": "Welcome to the Car Part Registration API!"}

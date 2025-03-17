from fastapi import FastAPI, HTTPException
import sqlitecloud
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from contextlib import contextmanager

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)


# Fetch API Key
SQLITE_CLOUD_API_KEY = os.getenv("SQLITE_CLOUD_API_KEY")
if not SQLITE_CLOUD_API_KEY:
    raise ValueError(" SQLITE_CLOUD_API_KEY is missing in the environment variables.")

CLOUD_DATABASE_CONNECTION_STRING = (
    f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"
)

# Initialize FastAPI
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure SQLite Cloud Connection Stays Open
@contextmanager
def get_db():
    """Manages database connection."""
    conn = None
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        conn.row_factory = sqlitecloud.Row  # Fetch results as dictionaries
        print(" Connected to SQLite Cloud!")
        yield conn
        conn.commit()  # Save changes
    except sqlitecloud.Error as e:
        print(f" Database Connection Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")
    finally:
        if conn:
            conn.close()
            print(" Database connection closed.")

def get_table_columns(table_name: str, conn):
    """Retrieve column names from a table for validation."""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name});")
    return {row[1] for row in cursor.fetchall()}  # Set for fast lookup

@app.get("/car_maker_data")
def get_car_maker_data():
    """Retrieve car makers and the count of registered cars per maker."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Make, COUNT(*) as count FROM cars GROUP BY Make ORDER BY count DESC")
            results = cursor.fetchall()
        return [{"car_maker": row[0], "count": row[1]} for row in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# --- Body Type Distribution API ---
@app.get("/body-type-distribution")
def get_body_type_distribution():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Body_Type, COUNT(*) as count FROM cars GROUP BY Body_Type")
            results = cursor.fetchall()
        return [{"body_type": row[0], "count": row[1]} for row in results]
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching body type distribution: {e}")

@app.get("/yearly-registrations")
def get_yearly_registrations():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Year, COUNT(*) as count FROM cars GROUP BY Year ORDER BY Year ASC")
            results = cursor.fetchall()
        return [{"year": row[0], "count": row[1]} for row in results]
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching yearly registrations: {e}")

@app.get("/fuel-type-distribution")
def get_fuel_type_distribution():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Fuel_Type, COUNT(*) as count FROM cars GROUP BY Fuel_Type")
            results = cursor.fetchall()
        return [{"fuel_type": row[0], "count": row[1]} for row in results]
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching fuel type distribution: {e}")
from fastapi import FastAPI, HTTPException
import sqlitecloud
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")
if not SQLITE_CLOUD_API_KEY:
    raise Exception("❌ API Key not found! Check your .env file and path.")

CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to establish database connection
def get_db():
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        return conn
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"SQLite Cloud connection error: {e}")

@app.get("/car-maker-stats")
def get_car_maker_stats():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Make, COUNT(*) as count FROM cars GROUP BY Make")
            results = cursor.fetchall()
        return [{"car_maker": row[0], "count": row[1]} for row in results]
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching car maker stats: {e}")

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
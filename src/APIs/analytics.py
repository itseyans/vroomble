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
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")
CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

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
    conn = None
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        print("✅ Connected to SQLite Cloud!")
        yield conn  # Keep connection open
    finally:
        if conn:
            conn.close()
            print("🔒 Database connection closed.")

# --- Car Maker Data API ---
@app.get("/car_maker_data")
def get_car_maker_data():
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            cursor.execute("SELECT COUNT(*) FROM user_registered_vehicles")
            user_vehicles_count = cursor.fetchone()[0]
            print(f"🔍 Total user-registered vehicles: {user_vehicles_count}")

            if user_vehicles_count == 0:
                return {"error": "No user-registered vehicles found."}

            query = """
            SELECT c.Make, COUNT(urv.CarID) AS count
            FROM user_registered_vehicles urv
            JOIN cars c ON urv.CarID = c.CarID
            GROUP BY c.Make
            ORDER BY count DESC;
            """
            cursor.execute(query)
            results = cursor.fetchall()

            print(f"🚗 Car Maker Data (Debugging): {results}")  # PRINT DATA BEFORE RETURNING

            if not results:
                return {"error": "No car maker data found."}

            return [{"car_maker": row[0], "count": row[1]} for row in results]

    except Exception as e:
        return {"error": str(e)}


# --- Body Type Distribution API ---
@app.get("/body-type-distribution")
def get_body_type_distribution():
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            cursor.execute("PRAGMA table_info(cars);")
            columns = [row[1] for row in cursor.fetchall()]

            if "Body_Type" not in columns:
                return {"error": "Column 'Body_Type' does not exist in cars table."}

            query = """
            SELECT c.Body_Type, COUNT(urv.CarID) as count
            FROM user_registered_vehicles urv
            JOIN cars c ON urv.CarID = c.CarID
            GROUP BY c.Body_Type;
            """
            cursor.execute(query)
            results = cursor.fetchall()

            if not results:
                return {"error": "No body type data found."}

            return [{"body_type": row[0], "count": row[1]} for row in results]

    except Exception as e:
        return {"error": str(e)}

# --- Yearly Registrations API ---
@app.get("/yearly-registrations")
def get_yearly_registrations():
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            cursor.execute("PRAGMA table_info(cars);")
            columns = [row[1] for row in cursor.fetchall()]

            if "Year" in columns:
                query = "SELECT Year, COUNT(*) as count FROM cars GROUP BY Year ORDER BY Year ASC"
            else:
                query = """
                SELECT strftime('%Y', c.Registration_Date) AS year, COUNT(*) as count
                FROM cars c
                GROUP BY year
                ORDER BY year ASC;
                """

            cursor.execute(query)
            results = cursor.fetchall()

            if not results:
                return {"error": "No yearly registration data found."}

            return [{"year": row[0], "count": row[1]} for row in results]

    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching yearly registrations: {e}")

# --- Fuel Type Distribution API ---
@app.get("/fuel-type-distribution")
def get_fuel_type_distribution():
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            cursor.execute("PRAGMA table_info(cars);")
            columns = [row[1] for row in cursor.fetchall()]

            if "Fuel_Type" not in columns:
                return {"error": "Column 'Fuel_Type' does not exist in cars table."}

            query = """
            SELECT c.Fuel_Type, COUNT(urv.CarID) as count
            FROM user_registered_vehicles urv
            JOIN cars c ON urv.CarID = c.CarID
            GROUP BY c.Fuel_Type;
            """
            cursor.execute(query)
            results = cursor.fetchall()

            if not results:
                return {"error": "No fuel type data found."}

            return [{"fuel_type": row[0], "count": row[1]} for row in results]

    except Exception as e:
        return {"error": str(e)}


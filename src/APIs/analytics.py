from fastapi import FastAPI, HTTPException
import sqlitecloud
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
# Specify the exact path of your .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)
                              
# Fetch API Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")

# Debugging: Print to verify
print("🔍 Loaded API Key:", SQLITE_CLOUD_API_KEY)

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

@app.get("/car_maker_data")
def get_car_maker_data():
    try:
        conn = get_db()
        cursor = conn.cursor()

        # ✅ Corrected SQL Query:
        # - Gets the CarID from user_registered_vehicles (since it's the main registered data)
        # - Matches CarID to cars table to get Make
        # - Counts occurrences of each Make based on how often a CarID appears in user_registered_vehicles
        query = """
        SELECT c.Make, COUNT(urv.CarID) AS count
        FROM user_registered_vehicles urv
        INNER JOIN cars c ON urv.CarID = c.CarID
        GROUP BY c.Make
        ORDER BY count DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        # ✅ Debugging Output
        print("🔍 SQL Query Results:", results)

        # Convert results into JSON format
        data = [{"car_maker": row[0], "count": row[1]} for row in results]

        conn.close()
        return data if data else {"message": "No car data found in database."}
    except Exception as e:
        return {"error": str(e)}


@app.get("/body-type-distribution")
def get_body_type_distribution():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Body_Type, COUNT(*) as count FROM user_registered_vehicles GROUP BY Body_Type")
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
            cursor.execute("SELECT Fuel_Type, COUNT(*) as count FROM user_registered_vehicles GROUP BY Fuel_Type")
            results = cursor.fetchall()
        return [{"fuel_type": row[0], "count": row[1]} for row in results]
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching fuel type distribution: {e}")
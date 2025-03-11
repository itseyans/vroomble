import logging
import sqlitecloud  # Using SQLite Cloud (not local sqlite3)
from fastapi import FastAPI, HTTPException, Depends, Cookie, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv  # Import load_dotenv
import jwt  # Import JWT for decoding the token

# ✅ Load Environment Variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# ✅ Fetch API Key and Secret Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")  # Fallback for local testing
ALGORITHM = "HS256"

# ✅ SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

# ✅ Establish Connection & Check Tables
try:
    with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
        print("✅ Connected to SQLite Cloud database!")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Existing Tables:", tables)
except sqlitecloud.Error as e:
    print(f"❌ SQLite Cloud connection error: {e}")

# ✅ FastAPI App Initialization
app = FastAPI()

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React App URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Logging Configuration
logging.basicConfig(
    filename="user_vehicle_registration.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ✅ User-Registered Vehicle Schema
class UserRegisteredVehicle(BaseModel):
    carID: int
    trim: str
    plateEnd: str
    color: str
    mileage: str

# ✅ Create `user_registered_vehicles` Table if Not Exists
def create_user_vehicle_table():
    """Ensures the 'user_registered_vehicles' table exists in SQLite Cloud."""
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS user_registered_vehicles (
                    UserRV_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    users_ID INTEGER NOT NULL,
                    CarID INTEGER NOT NULL,
                    Trim TEXT NOT NULL,
                    PlateEnd TEXT NOT NULL,
                    Color TEXT NOT NULL,
                    Mileage TEXT NOT NULL,
                    FOREIGN KEY (users_ID) REFERENCES users(users_ID),
                    FOREIGN KEY (CarID) REFERENCES cars(CarID)
                )
                """
            )
            conn.commit()
            logger.info("✅ SQLite Cloud Database table 'user_registered_vehicles' initialized.")
    except sqlitecloud.Error as e:
        logger.error(f"❌ Error initializing 'user_registered_vehicles' table: {e}")
        raise HTTPException(status_code=500, detail=f"SQLite Cloud error: {e}")

# ✅ Ensure Table Exists on Startup
create_user_vehicle_table()

# ✅ Function to Extract `users_ID` from Access Token
def get_current_user(access_token: str = Cookie(None)):
    """Extracts users_ID from JWT token stored in cookies."""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        users_ID: int = payload.get("users_ID")

        if users_ID is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return users_ID
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ API Endpoint to Register a Vehicle for a User
@app.post("/api/register-vehicle/")
async def register_vehicle(vehicle_data: UserRegisteredVehicle, users_ID: int = Depends(get_current_user)):
    """
    Registers a vehicle under the currently logged-in user by extracting users_ID from the session token.
    """
    try:
        logging.info(f"📥 Received registration request from User ID: {users_ID}")
        logging.info(f"📥 Received CarID: {vehicle_data.carID}, Type: {type(vehicle_data.carID)}")

        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            # ✅ Check if CarID exists in the 'cars' table
            cursor.execute("SELECT CarID FROM cars WHERE CarID = ?", (vehicle_data.carID,))
            existing_car = cursor.fetchone()

            if not existing_car:
                logging.warning(f"❌ CarID: {vehicle_data.carID} NOT found in 'cars' table.")
                raise HTTPException(status_code=400, detail="CarID does not exist in the database.")

            logging.info(f"✅ CarID: {vehicle_data.carID} found. Proceeding with registration.")

            # ✅ Insert user-registered vehicle with users_ID
            sql_query = """
                INSERT INTO user_registered_vehicles (users_ID, CarID, Trim, PlateEnd, Color, Mileage)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            params = (
                users_ID,  # Extracted from session token
                vehicle_data.carID,
                vehicle_data.trim,
                vehicle_data.plateEnd,
                vehicle_data.color,
                vehicle_data.mileage
            )

            logging.info(f"🚀 Executing SQL Query: {sql_query} with Params: {params}")

            cursor.execute(sql_query, params)
            conn.commit()
            logging.info("✅ Vehicle registered successfully!")
            return {"message": "User vehicle registered successfully"}

    except Exception as e:
        logging.error(f"❌ Error registering vehicle: {e}")
        logging.error(f"❌ Exception Details: {type(e).__name__}, {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ✅ API Endpoint to Fetch Registered Vehicles for a User
@app.get("/api/user-vehicles/")
async def get_user_vehicles(users_ID: int = Depends(get_current_user)):
    """
    Fetches all vehicles registered under the logged-in user.
    """
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT CarID, Trim, PlateEnd, Color, Mileage FROM user_registered_vehicles
                WHERE users_ID = ?
                """,
                (users_ID,)
            )
            vehicles = cursor.fetchall()

            if not vehicles:
                return {"message": "No vehicles registered by this user"}

            return [
                {
                    "carID": row[0],
                    "trim": row[1],
                    "plateEnd": row[2],
                    "color": row[3],
                    "mileage": row[4],
                }
                for row in vehicles
            ]

    except sqlitecloud.Error as e:
        logger.error(f"❌ Error fetching user vehicles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Root API Endpoint
@app.get("/")
async def root():
    return {"message": "🚗 User Vehicle Registration API is running"}

# ✅ Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"❌ Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": str(exc)},
    )

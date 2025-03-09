import logging
import sqlitecloud  # Using SQLite Cloud (not local sqlite3)
from fastapi import FastAPI, HTTPException, Request, status, Query
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

# ✅ SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey=9IwJf2Fz9xSDaQBetYibFbLhi7HrKlAEobNy9wjio9o"

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
                    CarID INTEGER NOT NULL,
                    Trim TEXT NOT NULL,
                    PlateEnd TEXT NOT NULL,
                    Color TEXT NOT NULL,
                    Mileage TEXT NOT NULL,
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

# ✅ API Endpoint to Register a Vehicle for a User
@app.post("/api/register-vehicle/")
async def register_vehicle(vehicle_data: UserRegisteredVehicle):
    try:
        logging.info(f"📥 Received registration request: {vehicle_data}")
        logging.info(f"📥 Received CarID: {vehicle_data.carID}, Type: {type(vehicle_data.carID)}")

        logging.info(f"✅ Pydantic Validated Data: {vehicle_data.dict()}") # ⭐️ Log after Pydantic validation

        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            logging.info(f"🔎 Checking if CarID: {vehicle_data.carID} exists in 'cars' table...")
            cursor.execute("SELECT CarID FROM cars WHERE CarID = ?", (vehicle_data.carID,))
            existing_car = cursor.fetchone()

            if not existing_car:
                logging.warning(f"❌ CarID: {vehicle_data.carID} NOT found in 'cars' table.")
                raise HTTPException(status_code=400, detail="CarID does not exist in the database.")

            logging.info(f"✅ CarID: {vehicle_data.carID} found. Proceeding with registration.")

            sql_query = """
                INSERT INTO user_registered_vehicles (CarID, Trim, PlateEnd, Color, Mileage)
                VALUES (?, ?, ?, ?, ?)
            """
            params = (
                vehicle_data.carID,
                vehicle_data.trim,
                vehicle_data.plateEnd,
                vehicle_data.color,
                vehicle_data.mileage
            )
            logging.info(f"🚀 Executing SQL Query: {sql_query} with Params: {params}") # ⭐️ Log SQL query and params

            cursor.execute(sql_query, params)
            conn.commit()
            logging.info("✅ Vehicle registered successfully!")
            return {"message": "User vehicle registered successfully"}

    except Exception as e:
        logging.error(f"❌ Error registering vehicle: {e}")
        logging.error(f"❌ Exception Details: {type(e).__name__}, {e}") # ⭐️ Log exception type and details
        raise HTTPException(status_code=500, detail=str(e)) # Keep as 500 for general errors, let's see if it changes to 422 based on logs


# ✅ Root Endpoint
@app.get("/")
async def root():
    return {"message": "🚗 User Vehicle Registration API is running"}

# ✅ Exception Handlers
# ✅ Custom Exception for Database Errors
class DatabaseError(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(status_code=500, detail=detail or "Database error.")

# ✅ Function to Get Cloud Database Connection
def get_db_connection():
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        return conn
    except sqlitecloud.Error as e:
        logger.error(f"❌ Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# ✅ API Endpoint to Fetch Vehicles with Optional Search Query (Includes Variant & Drivetrain)
@app.get("/api/vehicles")
async def get_vehicles(q: str = Query(None, description="Search query")):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            if q:
                cursor.execute(
                    """
                    SELECT CarID as id, Make, Model, 
                           COALESCE(Variant, 'N/A') as Variant, 
                           Drivetrain
                    FROM cars
                    WHERE Make LIKE ? OR Model LIKE ? OR Variant LIKE ? OR Drivetrain LIKE ?
                    """,
                    (f"%{q}%", f"%{q}%", f"%{q}%", f"%{q}%"),
                )
            else:
                cursor.execute(
                    """
                    SELECT CarID as id, Make, Model, 
                           COALESCE(Variant, 'N/A') as Variant, 
                           Drivetrain
                    FROM cars
                    """
                )
                
            results = cursor.fetchall()
            return [
                {
                    "id": row[0], 
                    "make": row[1], 
                    "model": row[2], 
                    "variant": row[3],  # If NULL, it returns 'N/A'
                    "drivetrain": row[4]
                } for row in results
            ]
    except sqlitecloud.Error as e:
        logger.error(f"❌ Error fetching vehicles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Root API Endpoint
@app.get("/")
async def root():
    return {"message": "🚗 Welcome to the Vehicle Registration API!"}

# ✅ Exception Handler for Request Validation Errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"❌ Validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )

# ✅ Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"❌ Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": str(exc)},
    )

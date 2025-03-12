import logging
import sqlitecloud
from fastapi import FastAPI, HTTPException, Depends, Cookie, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
from dotenv import load_dotenv
import jwt
from fastapi.staticfiles import StaticFiles

# ✅ Load Environment Variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# ✅ Fetch API Key and Secret Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"

# ✅ SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

# ✅ FastAPI App Initialization
app = FastAPI()

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

# ✅ Set Dynamic Upload Directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure uploads folder exists

# ✅ Serve Static Files for Images
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/car_images", StaticFiles(directory=UPLOAD_DIR), name="car_images")

# ✅ Create Tables for Vehicles & Images
def create_tables():
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

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS vehicle_images (
                    ImageID INTEGER PRIMARY KEY AUTOINCREMENT,
                    usersRV_ID INTEGER NOT NULL,
                    ImagePath TEXT NOT NULL,
                    FOREIGN KEY (usersRV_ID) REFERENCES user_registered_vehicles(UserRV_ID)
                )
                """
            )

            conn.commit()
            logger.info("✅ Tables initialized successfully.")
    except sqlitecloud.Error as e:
        logger.error(f"❌ Database initialization error: {e}")
        raise HTTPException(status_code=500, detail="Database initialization failed.")

# ✅ Ensure Tables Exist
create_tables()

# ✅ Extract users_ID from JWT Token
def get_current_user(access_token: str = Cookie(None)):
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

# ✅ Register Vehicle API with Image
@app.post("/api/register-vehicle-with-image/")
async def register_vehicle_with_image(
    users_ID: int = Depends(get_current_user),
    carID: int = Form(...),
    trim: str = Form(...),
    plateEnd: str = Form(...),
    color: str = Form(...),
    mileage: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            # ✅ Insert vehicle details
            cursor.execute(
                """
                INSERT INTO user_registered_vehicles (users_ID, CarID, Trim, PlateEnd, Color, Mileage)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (users_ID, carID, trim, plateEnd, color, mileage),
            )

            usersRV_ID = cursor.lastrowid  # ✅ Get the generated usersRV_ID

            # ✅ Save Image to `uploads/`
            filename = f"{usersRV_ID}_{image.filename}"
            image_path = os.path.join(UPLOAD_DIR, filename)  
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            # ✅ Store ONLY filename in database
            cursor.execute(
                """
                INSERT INTO vehicle_images (usersRV_ID, ImagePath)
                VALUES (?, ?)
                """,
                (usersRV_ID, filename),
            )

            conn.commit()

            return {"message": "User vehicle registered successfully with image", "usersRV_ID": usersRV_ID}

    except sqlitecloud.Error as e:
        logger.error(f"❌ Database error: {e}")
        raise HTTPException(status_code=500, detail="Vehicle registration failed.")


# ✅ Fetch Registered Vehicles for a User
@app.get("/api/user-vehicles/")
async def get_user_vehicles(users_ID: int = Depends(get_current_user)):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT urv.UserRV_ID, c.Make, c.Model, c.Variant, c.Year
                FROM user_registered_vehicles urv
                JOIN cars c ON urv.CarID = c.CarID
                WHERE urv.users_ID = ?
                """,
                (users_ID,)
            )
            vehicles = cursor.fetchall()

            if not vehicles:
                return {"message": "No vehicles registered by this user"}

            return [
                {
                    "usersRV_ID": row[0],
                    "carName": f"{row[1]} {row[2]} {row[3]} ({row[4]})",
                }
                for row in vehicles
            ]

    except sqlitecloud.Error as e:
        logger.error(f"❌ Error fetching user vehicles: {e}")
        raise HTTPException(status_code=500, detail=str(e))
                              

# ✅ Fetch Images for a Registered Vehicle
@app.get("/api/vehicle-images/{usersRV_ID}")
async def get_vehicle_images(usersRV_ID: int):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT ImagePath FROM vehicle_images WHERE usersRV_ID = ?
                """,
                (usersRV_ID,)
            )
            images = cursor.fetchall()

            if not images:
                return {"message": "No images found for this vehicle"}

            return {"images": [row[0] for row in images]}  # ✅ Returns only filenames

    except sqlitecloud.Error as e:
        logger.error(f"❌ Error fetching vehicle images: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    
# ✅ Fetch Vehicle Count for Logged-in User
@app.get("/user/vehicle-count")
async def get_vehicle_count(users_ID: int = Depends(get_current_user)):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT COUNT(*) FROM user_registered_vehicles WHERE users_ID = ?",
                (users_ID,),
            )
            vehicle_count = cursor.fetchone()[0]  # Get count from DB

        return {"vehicle_count": vehicle_count}

    except sqlitecloud.Error as e:
        logger.error(f"❌ Error fetching vehicle count: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.exception(f"❌ Unexpected error fetching vehicle count: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})


# ✅ Root API Endpoint
@app.get("/")
async def root():
    return {"message": "🚗 User Vehicle Registration API is running"}

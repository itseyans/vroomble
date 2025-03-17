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

# Load Environment Variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Fetch API Key and Secret Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"

# SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

# FastAPI App Initialization
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging Configuration
logging.basicConfig(
    filename="user_vehicle_registration.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Set Dynamic Upload Directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure uploads folder exists

# Serve Static Files for Images
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/car_images", StaticFiles(directory=UPLOAD_DIR), name="car_images")

# Create Tables for Vehicles & Images
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
            logger.info("Tables initialized successfully.")
    except sqlitecloud.Error as e:
        logger.error(f"Database initialization error: {e}")
        raise HTTPException(status_code=500, detail="Database initialization failed.")

# Ensure Tables Exist
create_tables()

# Extract users_ID from JWT Token
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
    
def insert_image_path(usersRV_ID: int, image_path: str):
    """
    Inserts the uploaded image path into the vehicle_images table.
    """
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO vehicle_images (usersRV_ID, ImagePath, user_registered_vehicle)
                VALUES (?, ?, 'user_registered_vehicle')
                """,
                (usersRV_ID, image_path),
            )

            conn.commit()
            print(f" Image {image_path} saved in database for UserRV_ID {usersRV_ID}")
    except sqlitecloud.Error as e:
        print(f" Failed to insert image path: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")


@app.post("/api/upload-vehicle-images/")
async def upload_vehicle_images(
    UserRV_ID: int = Form(...),
    images: list[UploadFile] = File(...)
):
    """
    Handles the upload of vehicle images, stores them in the `uploads/` directory,
    and inserts image paths into the `vehicle_images` table.
    """
    try:
        saved_filenames = []

        for image in images:
            if image:
                filename = image.filename  #  Keep original naming
                image_path = os.path.join(UPLOAD_DIR, filename)  #  Store in `uploads/`

                # Save image to disk
                with open(image_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)

                # Insert into database (Fix: No `user_registered_vehicle` column)
                insert_image_path(UserRV_ID, filename)  

                saved_filenames.append(filename)

        return {"message": "Images uploaded successfully!", "file_paths": saved_filenames}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")


@app.get("/api/user-vehicles/")
async def get_user_vehicles(users_ID: int = Depends(get_current_user)):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            # Fetch user vehicles
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

            final_vehicles = []
            for vehicle in vehicles:
                usersRV_ID = vehicle[0]

                # Fetch the correct image filename
                cursor.execute(
                    "SELECT ImagePath FROM vehicle_images WHERE usersRV_ID = ? LIMIT 1",
                    (usersRV_ID,),
                )
                image_row = cursor.fetchone()

                # Use correct filename from database or fallback to default
                image_filename = image_row[0] if image_row else "default.jpg"
                image_url = f"http://localhost:8004/uploads/{image_filename}"

                final_vehicles.append({
                    "usersRV_ID": usersRV_ID,
                    "carName": f"{vehicle[1]} {vehicle[2]} {vehicle[3]} ({vehicle[4]})",
                    "carImage": image_url
                })

            return final_vehicles

    except sqlitecloud.Error as e:
        logger.error(f"Error fetching user vehicles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

                              

# Fetch Images for a Registered Vehicle
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

            return {"images": [row[0] for row in images]}  # Returns only filenames

    except sqlitecloud.Error as e:
        logger.error(f"Error fetching vehicle images: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    
# Fetch Vehicle Count for Logged-in User
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
        logger.error(f"Error fetching vehicle count: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.exception(f"Unexpected error fetching vehicle count: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

# Ensure the 'is_listed' column exists in the database
def ensure_column_exists():
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                ALTER TABLE user_registered_vehicles ADD COLUMN is_listed INTEGER DEFAULT 0
            """)
            conn.commit()
    except sqlitecloud.Error as e:
        if "duplicate column" not in str(e).lower():
            print("Column already exists.")

ensure_column_exists()

# API to list a vehicle (set is_listed to 1)
@app.post("/api/list-vehicle/")
async def list_vehicle(usersRV_ID: int = Form(...)):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE user_registered_vehicles 
                SET is_listed = 1
                WHERE UserRV_ID = ?
            """, (usersRV_ID,))
            conn.commit()

        return {"message": f"Vehicle {usersRV_ID} is now listed."}

    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# API to unlist a vehicle (set is_listed to 0)
@app.post("/api/unlist-vehicle/")
async def unlist_vehicle(usersRV_ID: int = Form(...)):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE user_registered_vehicles 
                SET is_listed = 0
                WHERE UserRV_ID = ?
            """, (usersRV_ID,))
            conn.commit()

        return {"message": f"Vehicle {usersRV_ID} is now unlisted."}

    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# API to fetch listed vehicles
@app.get("/api/listed-vehicles/")
async def get_listed_vehicles():
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM user_registered_vehicles WHERE is_listed = 1
            """)
            vehicles = cursor.fetchall()

        return {"listed_vehicles": vehicles}

    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/vehicle-details/{usersRV_ID}")
async def get_vehicle_details(usersRV_ID: int):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            cursor.execute("""
                SELECT c.Make, c.Model, c.Variant, c.Year, urv.Color, urv.Trim, urv.Mileage, urv.PlateEnd
                FROM user_registered_vehicles urv
                JOIN cars c ON urv.CarID = c.CarID
                WHERE urv.UserRV_ID = ?
            """, (usersRV_ID,))

            vehicle = cursor.fetchone()
            if not vehicle:
                raise HTTPException(status_code=404, detail="Vehicle not found")

            return {
                "make": vehicle[0],
                "model": vehicle[1],
                "variant": vehicle[2],
                "year": vehicle[3],
                "color": vehicle[4],
                "trim": vehicle[5],
                "mileage": vehicle[6],
                "plateEnd": vehicle[7],
            }

    except sqlitecloud.Error as e:
        logger.error(f" Error fetching vehicle details: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def insert_image_path(usersRV_ID: int, image_path: str):
    """
    Inserts the uploaded image path into the vehicle_images table.
    """
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO vehicle_images (usersRV_ID, ImagePath)
                VALUES (?, ?)
                """,
                (usersRV_ID, image_path),
            )

            conn.commit()
            print(f" Image {image_path} saved in database for UserRV_ID {usersRV_ID}")
    except sqlitecloud.Error as e:
        print(f" Failed to insert image path: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")


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

            # Insert vehicle details
            cursor.execute(
                """
                INSERT INTO user_registered_vehicles (users_ID, CarID, Trim, PlateEnd, Color, Mileage)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (users_ID, carID, trim, plateEnd, color, mileage),
            )

            usersRV_ID = cursor.lastrowid  # Get the generated usersRV_ID

            # Save Image to `uploads/`
            filename = f"{usersRV_ID}_{image.filename}"
            image_path = os.path.join(UPLOAD_DIR, filename)  
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            # Store filename in database
            insert_image_path(usersRV_ID, filename)  

            conn.commit()
            return {"message": "User vehicle registered successfully with image", "usersRV_ID": usersRV_ID}

    except sqlitecloud.Error as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Vehicle registration failed.")

# Root API Endpoint
@app.get("/")
async def root():
    return {"message": " User Vehicle Registration API is running"}


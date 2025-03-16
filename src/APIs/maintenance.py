import logging
import sqlitecloud
from fastapi import FastAPI, HTTPException, Form, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import random
import uuid
import shutil
from datetime import datetime
from dotenv import load_dotenv

# ✅ Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# ✅ Fetch API Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")
CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

# ✅ FastAPI App Initialization
app = FastAPI()

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Allow all origins (Update this for production security)
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # ✅ Allow all headers
)

# ✅ Logging Configuration
logging.basicConfig(
    filename="maintenance.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ✅ Uploads Directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "maintenance_Photos")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ✅ Create Maintenance Table
def create_maintenance_table():
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS vehicle_maintenance (
                    MaintenanceID INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserRV_ID INTEGER NOT NULL,
                    ChangeType TEXT NOT NULL CHECK(ChangeType IN ('Maintenance', 'Modding', 'Accidents')),
                    Details TEXT NOT NULL,
                    Cost REAL NOT NULL CHECK(Cost >= 0),
                    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    ImagePath TEXT,
                    FOREIGN KEY (UserRV_ID) REFERENCES user_registered_vehicles(UserRV_ID)
                )
                """
            )
            conn.commit()
            logger.info("✅ Vehicle maintenance table created successfully.")
    except sqlitecloud.Error as e:
        logger.error(f"❌ Error creating maintenance table: {e}")
        raise HTTPException(status_code=500, detail="Database initialization failed.")

# ✅ Ensure Table Exists
create_maintenance_table()

        
@app.post("/api/add-maintenance/")
async def add_maintenance(
    UserRV_ID: int = Form(...),
    ChangeType: str = Form(...),
    Details: str = Form(...),
    Cost: float = Form(...),
    Date: str = Form(...),
    images: list[UploadFile] = File(None)  # ✅ Optional images
):
    print(f"🟢 Received UserRV_ID: {UserRV_ID}")  # Debugging log
    print(f"🟢 Received Images: {len(images) if images else 0}")

    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        saved_filenames = []
        if images:
            for image in images:
                if image:
                    # ✅ Extract the original filename
                    original_filename = os.path.basename(image.filename)
                    
                    # ✅ Ensure safe filename (remove spaces, special chars)
                    safe_filename = original_filename.replace(" ", "_").replace("(", "").replace(")", "")

                    # ✅ Prefix with Changes_UserRV_ID_
                    new_filename = f"Changes_UserRV_{UserRV_ID}_{safe_filename}"

                    # ✅ Check if file exists and avoid overwriting
                    file_path = os.path.join(UPLOAD_DIR, new_filename)
                    if os.path.exists(file_path):
                        # Append timestamp if file already exists
                        new_filename = f"Changes_UserRV_{UserRV_ID}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{safe_filename}"
                        file_path = os.path.join(UPLOAD_DIR, new_filename)

                    print(f"🟢 Saving file: {file_path}")  # Debugging

                    with open(file_path, "wb") as buffer:
                        shutil.copyfileobj(image.file, buffer)

                    saved_filenames.append(new_filename)

        # ✅ Store file paths in database
        image_paths_str = ",".join(saved_filenames) if saved_filenames else None

        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO vehicle_maintenance (UserRV_ID, ChangeType, Details, Cost, Date, ImagePath)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (UserRV_ID, ChangeType, Details, Cost, Date, image_paths_str),
            )
            conn.commit()

        return {"message": "✅ Maintenance record added successfully!", "filenames": saved_filenames}

    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")

# ✅ Delete Maintenance Record API
@app.delete("/api/delete-maintenance/{MaintenanceID}")
async def delete_maintenance(MaintenanceID: int):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            
            # ✅ Get Image Path Before Deleting
            cursor.execute("SELECT ImagePath FROM vehicle_maintenance WHERE MaintenanceID = ?", (MaintenanceID,))
            image_row = cursor.fetchone()

            # ✅ Delete the Record
            cursor.execute("DELETE FROM vehicle_maintenance WHERE MaintenanceID = ?", (MaintenanceID,))
            conn.commit()

            # ✅ Remove Image If Exists
            if image_row and image_row[0]:
                image_path = os.path.join(UPLOAD_DIR, image_row[0])
                if os.path.exists(image_path):
                    os.remove(image_path)

        return {"message": "✅ Maintenance record deleted successfully"}
    
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

# ✅ Update Maintenance Record API
@app.put("/api/update-maintenance/{MaintenanceID}")
async def update_maintenance(
    MaintenanceID: int,
    ChangeType: str = Form(...),
    Details: str = Form(...),
    Cost: float = Form(...)
):
    try:
        with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE vehicle_maintenance 
                SET ChangeType = ?, Details = ?, Cost = ?
                WHERE MaintenanceID = ?
                """,
                (ChangeType, Details, Cost, MaintenanceID)
            )
            conn.commit()
        return {"message": "✅ Maintenance record updated successfully"}
    
    except sqlitecloud.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    
@app.post("/api/upload-vehicle-images/")
async def upload_vehicle_images(
    UserRV_ID: int = Form(...),
    images: list[UploadFile] = File(...)
):
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)  # ✅ Ensure the directory exists

        saved_filenames = []
        for image in images:
            if image:
                extension = os.path.splitext(image.filename)[-1]
                filename = f"Changes_{UserRV_ID}_{datetime.now().strftime('%Y%m%d%H%M%S')}{extension}"
                image_path = os.path.join(UPLOAD_DIR, filename)

                with open(image_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)

                saved_filenames.append(filename)

        return {"message": "✅ Images uploaded successfully!", "file_paths": saved_filenames}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")


                                                                         

# ✅ Root API Endpoint
@app.get("/")
async def root():
    return {"message": "🚗 Vehicle Maintenance API is running"}

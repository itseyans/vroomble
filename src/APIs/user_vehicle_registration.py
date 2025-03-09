import logging
import sqlitecloud  # Using SQLite Cloud (not local sqlite3)
from fastapi import FastAPI, HTTPException, Request, status, Query
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

# ✅ Define SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey=9IwJf2Fz9xSDaQBetYibFbLhi7HrKlAEobNy9wjio9o"

# ✅ CORS Configuration (Allow Frontend Requests)
origins = [
    "http://localhost:3001",  # Update with frontend URL
    "localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Logging Configuration
logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

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

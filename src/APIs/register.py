import logging
import sqlitecloud  # Using SQLite Cloud (not local sqlite3)
import os
from fastapi import FastAPI, Form, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from passlib.context import CryptContext
from dotenv import load_dotenv  # Import load_dotenv

app = FastAPI()

# CORS Configuration (Allow frontend requests from Next.js)
origins = [
    "http://localhost:3000",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Specify the exact path of your .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)
                              
# Fetch API Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")

# Debugging: Print to verify
print(" Loaded API Key:", SQLITE_CLOUD_API_KEY)

if not SQLITE_CLOUD_API_KEY:
    raise Exception("API Key not found! Check your .env file and path.")

CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

# Check and Establish Connection
try:
    with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
        print("Successfully connected to SQLite Cloud database!")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Existing Tables:", tables)
except sqlitecloud.Error as e:
    print(f"SQLite Cloud connection error: {e}")

# Logging Configuration
logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Exception for Database Errors
class DatabaseError(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(status_code=500, detail=detail or "Database error.")

# Pydantic Model for User Registration
class Registration(BaseModel):
    firstName: str
    lastName: str
    contactNumber: str
    email: str
    password: str

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

# Function to Get Cloud Database Connection
def get_db_connection():
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        return conn
    except sqlitecloud.Error as e:
        logger.error(f"Error connecting to cloud database: {e}")
        raise DatabaseError(detail=f"Cloud database connection error: {e}")

# Function to Ensure `users` Table Exists in SQLite Cloud
def create_table_if_not_exists():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstName TEXT NOT NULL,
                    lastName TEXT NOT NULL,
                    contactNumber TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
            ''')
            conn.commit()
            print("Table 'users' created or already exists.")
    except sqlitecloud.Error as e:
        logger.error(f"Error creating table in SQLite Cloud: {e}")
        raise DatabaseError(detail=f"Cloud database table initialization error: {e}")

# Ensure table exists on startup
create_table_if_not_exists()

# API Endpoint to Register a New User
@app.post("/register/")
async def register_user(registration_data: Registration):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            hashed_password = hash_password(registration_data.password)

            # Insert new user
            cursor.execute('''
                INSERT INTO users (firstName, lastName, contactNumber, email, password)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                registration_data.firstName,
                registration_data.lastName,
                registration_data.contactNumber,
                registration_data.email,
                hashed_password,
            ))

            conn.commit()
        return {"message": "User registered successfully!"}

    except sqlitecloud.Error as e:
        logger.error(f"Database error during user registration: {e}")
        return JSONResponse(status_code=500, content={"error": f"Database error: {e}"})
    except Exception as e:
        logger.exception(f"Error during registration: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# API Root Endpoint (Welcome Message)
@app.get("/")
async def root():
    return {"message": "Welcome to the User Registration API!"}

# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": str(exc)},
    )

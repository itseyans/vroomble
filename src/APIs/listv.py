import sqlitecloud
from fastapi import FastAPI, HTTPException, Depends, Query

# Database connection
CLOUD_DATABASE_CONNECTION_STRING = "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db"

app = FastAPI()

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
            raise HTTPException(status_code=500, detail="Failed to add is_listed column.")

ensure_column_exists()

# API to list a vehicle (set is_listed to 1)
@app.post("/api/list-vehicle/")
async def list_vehicle(usersRV_ID: int = Query(...)):
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
async def unlist_vehicle(usersRV_ID: int = Query(...)):
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

# API to get all listed vehicles
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

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import joblib
import numpy as np

app = FastAPI()

MODEL_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\trained_model.pkl"
SCALER_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\scaler.pkl"
DB_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\Vroomble Dataset\prediction_database.db"

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

def fetch_from_db(query, params=()):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(query, params)
        results = cursor.fetchall()
        conn.close()
        return [row[0] for row in results] if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.middleware.cors import CORSMiddleware

# Enable CORS (IMPORTANT: Fixes frontend not fetching data issue)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/car-makers")
def get_car_makers():
    try:
        makers = fetch_from_db("SELECT DISTINCT make FROM cars")
        if not makers:
            return {"makers": []}  # Return empty array instead of 404
        return {"makers": makers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")


@app.get("/car-models")
def get_car_models(make: str):
    models = fetch_from_db("SELECT DISTINCT model FROM cars WHERE make = ?", (make,))
    if not models:
        raise HTTPException(status_code=404, detail="No models found for this maker.")
    return {"models": models}

@app.get("/modification-types")
def get_modification_types(model: str):
    types = fetch_from_db("SELECT DISTINCT modification_type FROM car_modifications WHERE model = ?", (model,))
    return {"modification_types": types if types else ["Standard"]}

@app.get("/car-parts")
def get_car_parts(model: str):
    parts = fetch_from_db("SELECT DISTINCT part_name FROM car_parts WHERE model = ?", (model,))
    return {"parts": parts if parts else ["Default Part"]}

class PredictionRequest(BaseModel):
    make: str
    model_name: str
    modification_type: str
    selected_parts: list
    months: int

@app.post("/predict-price")
def predict_price(request: PredictionRequest):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT Base_Price_PHP, Monthly_Inflation_Rate FROM cars WHERE make = ? AND model = ?",
            (request.make, request.model_name),
        )
        car_info = cursor.fetchone()
        conn.close()

        if not car_info:
            raise HTTPException(status_code=404, detail="Car not found.")

        base_price, inflation_rate = car_info
        modification_cost = 0

        if request.selected_parts:
            placeholders = ",".join(["?" for _ in request.selected_parts])
            query = f"""
                SELECT SUM(Modification_Cost_PHP) FROM car_modifications
                WHERE modification_type = ? AND model = ? AND part_name IN ({placeholders})
            """
            params = [request.modification_type, request.model_name] + request.selected_parts
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute(query, params)
            modification_cost = cursor.fetchone()[0] or 0
            conn.close()

        future_inflation = (1 + inflation_rate) ** request.months
        predicted_price = (base_price + modification_cost) * future_inflation

        return {
            "Make": request.make,
            "Model": request.model_name,
            "Modification Type": request.modification_type,
            "Selected Car Parts": request.selected_parts,
            "Base Price (PHP)": base_price,
            "Car Parts Cost (PHP)": modification_cost,
            "Current Total Price (PHP)": base_price + modification_cost,
            f"Predicted Price After {request.months} Months (PHP)": predicted_price,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

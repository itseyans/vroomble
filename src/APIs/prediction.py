from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import pandas as pd
import numpy as np
import joblib

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's URL, e.g., "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Absolute paths for model, scaler, and database
MODEL_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\trained_model.pkl"
SCALER_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\scaler.pkl"
DB_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\Vroomble Dataset\prediction_database.db"

# Load trained model and scaler
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    raise RuntimeError(f"Error loading AI model or scaler: {e}")

# Define request model
class PredictionRequest(BaseModel):
    make: str
    model_name: str
    modification_type: str
    selected_parts: list[str]
    months: int

@app.get("/car-makers", response_model=list[str])
def get_car_makers():
    """Fetch distinct car makers from the database."""
    with sqlite3.connect(DB_PATH) as conn:
        query = "SELECT DISTINCT Make FROM Car_Model"
        df = pd.read_sql_query(query, conn)
    return df["Make"].tolist() if not df.empty else []

@app.get("/car-models", response_model=list[str])
def get_car_models(make: str = Query(..., title="Car Maker")):
    """Fetch car models for a given maker."""
    with sqlite3.connect(DB_PATH) as conn:
        query = "SELECT DISTINCT Model FROM Car_Model WHERE Make = ?"
        df = pd.read_sql_query(query, conn, params=[make])
    return df["Model"].tolist() if not df.empty else []

@app.get("/modification-types", response_model=list[str])
def get_modification_types(model: str = Query(..., title="Car Model")):
    """Fetch distinct modification types from the database."""
    with sqlite3.connect(DB_PATH) as conn:
        query = "SELECT DISTINCT Modification_Type FROM Car_Modifications WHERE Model = ?"
        df = pd.read_sql_query(query, conn, params=[model])
    return df["Modification_Type"].tolist() if not df.empty else []

@app.get("/car-parts", response_model=list[str])
def get_car_parts(model: str = Query(..., title="Car Model"), modification_type: str = Query(..., title="Modification Type")):
    """Fetch car parts for a given model and modification type."""
    with sqlite3.connect(DB_PATH) as conn:
        query = "SELECT DISTINCT Car_Part FROM Car_Modifications WHERE Model = ? AND Modification_Type = ?"
        df = pd.read_sql_query(query, conn, params=[model, modification_type])
    return df["Car_Part"].tolist() if not df.empty else []

import numpy as np

@app.post("/predict-price")
def predict_price(request: PredictionRequest):
    """Predict car price based on modification and inflation rate."""
    with sqlite3.connect(DB_PATH) as conn:
        query_car = """
            SELECT Base_Price_PHP, Monthly_Inflation_Rate FROM Car_Model
            WHERE Make = ? AND Model = ?
        """
        car_info = pd.read_sql_query(query_car, conn, params=(request.make, request.model_name))
    
    if car_info.empty:
        raise HTTPException(status_code=404, detail=f"Car '{request.make} {request.model_name}' not found.")
    
    base_price = float(car_info.iloc[0]["Base_Price_PHP"])  # Convert numpy type to float
    inflation_rate = float(car_info.iloc[0]["Monthly_Inflation_Rate"])
    
    placeholders = ','.join('?' for _ in request.selected_parts)
    query_mod = f"""
        SELECT SUM(Modification_Cost_PHP) as mod_cost 
        FROM Car_Modifications 
        WHERE Modification_Type = ? AND Model = ? AND Car_Part IN ({placeholders})
    """
    params = [request.modification_type, request.model_name] + request.selected_parts
    with sqlite3.connect(DB_PATH) as conn:
        mod_df = pd.read_sql_query(query_mod, conn, params=params)
    modification_cost = float(mod_df.iloc[0]["mod_cost"]) if not mod_df.empty and mod_df.iloc[0]["mod_cost"] is not None else 0
    
    future_inflation = (1 + inflation_rate) ** request.months
    features_scaled = scaler.transform([[base_price * future_inflation, modification_cost, inflation_rate]])
    predicted_price = float(model.predict(features_scaled)[0])  # Convert numpy type to float

    return {
        "Make": request.make,
        "Model": request.model_name,
        "Modification Type": request.modification_type,
        "Selected Car Parts": request.selected_parts,
        "Base Price (PHP)": base_price,
        "Car Parts Cost (PHP)": modification_cost,
        "Current Total Price (PHP)": base_price + modification_cost,
        f"Predicted Price After {request.months} Months (PHP)": predicted_price
    }


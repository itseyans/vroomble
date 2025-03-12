from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's URL, e.g., "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Robust Path Handling
current_dir = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current script
project_root = os.path.dirname(os.path.dirname(current_dir)) # Get the root of the project

MODEL_PATH = os.path.join(project_root, "src", "AI", "trained_model.pkl")
SCALER_PATH = os.path.join(project_root, "src", "AI", "scaler.pkl")
DB_PATH = os.path.join(project_root, "Vroomble Dataset", "prediction_database.db")

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
        car_info = pd.read_sql_query(query_car, conn, params=[request.make, request.model_name])

    if car_info.empty:
        raise HTTPException(status_code=404, detail=f"Car '{request.make} {request.model_name}' not found.")

    base_price = float(car_info.iloc[0]["Base_Price_PHP"])  # Convert numpy type to float
    inflation_rate = float(car_info.iloc[0]["Monthly_Inflation_Rate"])

    # ✅ Fix: Properly handling modification costs
    modification_cost = 0.0

    if request.selected_parts:
        placeholders = ','.join(['?'] * len(request.selected_parts))
        query_mod = f"""
            SELECT DISTINCT Car_Part, Modification_Cost_PHP
            FROM Car_Modifications 
            WHERE Modification_Type = ? 
            AND Model = ? 
            AND Car_Part IN ({placeholders})
        """
        params = [request.modification_type, request.model_name] + request.selected_parts
    else:
        query_mod = """
            SELECT DISTINCT Car_Part, Modification_Cost_PHP
            FROM Car_Modifications 
            WHERE Modification_Type = ? 
            AND Model = ?
        """
        params = [request.modification_type, request.model_name]

    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(query_mod, params)
        mod_results = cursor.fetchall()

    # ✅ Correctly Sum the Modification Costs (Avoiding Duplicates)
    modification_cost = sum(float(row[1]) for row in mod_results if row[1] is not None)

    # ✅ Correct Inflation Calculation Based on Trained Model
    future_price = (base_price + modification_cost) * ((1 + inflation_rate) ** (request.months / 12))

    # ✅ Fix: Ensure "months" is included in feature scaling
    features_scaled = scaler.transform([[base_price, modification_cost, inflation_rate, request.months]])

    # ✅ Use the trained model to predict the price
    predicted_price = float(model.predict(features_scaled)[0])



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

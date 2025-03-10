# prediction.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import sqlite3
import joblib

app = FastAPI()

MODEL_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\trained_model.pkl"
SCALER_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\scaler.pkl"
DB_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\Vroomble Dataset\prediction_database.db"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

class PredictionRequest(BaseModel):
    make: str
    model_name: str
    modification_type: str
    selected_parts: list[str]
    months: int

@app.post("/predict-price")
def predict_price(request: PredictionRequest):
    conn = sqlite3.connect(DB_PATH)

    car = pd.read_sql_query(
        "SELECT Base_Price_PHP, Monthly_Inflation_Rate FROM Car_Model WHERE Make=? AND Model=?",
        conn, params=(request.make, request.model_name))

    if car.empty:
        conn.close()
        raise HTTPException(404, "Car not found.")

    base_price = car.iloc[0]["Base_Price_PHP"]
    inflation_rate = car.iloc[0]["Monthly_Inflation_Rate"]

    placeholders = ','.join(['?']*len(request.selected_parts))
    mods = pd.read_sql_query(
        f"SELECT SUM(Modification_Cost_PHP) as mod_cost FROM Car_Modifications WHERE Modification_Type=? AND Model=? AND Car_Part IN ({placeholders})",
        conn, params=[request.modification_type, request.model_name]+request.selected_parts)

    modification_cost = mods.iloc[0]["mod_cost"] or 0

    future_inflation = (1 + inflation_rate) ** request.months
    scaled_features = scaler.transform([[base_price * future_inflation, modification_cost, inflation_rate]])
    prediction = model.predict(scaled_features)[0]

    conn.close()

    return {
        "Make": request.make,
        "Model": request.model_name,
        "Modification Type": request.modification_type,
        "Selected Car Parts": request.selected_parts,
        "Base Price (PHP)": float(base_price),
        "Car Parts Cost (PHP)": float(modification_cost),
        "Current Total Price (PHP)": float(base_price + modification_cost),
        f"Predicted Price After {request.months} Months (PHP)": float(prediction)
    }

@app.get("/car-makers")
def car_makers():
    with sqlite3.connect(DB_PATH) as conn:
        makers = pd.read_sql("SELECT DISTINCT Make FROM Car_Model", conn)
    return {"makers": makers["Make"].tolist()}

@app.get("/car-models")
def car_models(make: str):
    with sqlite3.connect(DB_PATH) as conn:
        models = pd.read_sql("SELECT DISTINCT Model FROM Car_Model WHERE Make=?", conn, params=[make])
    return {"models": models["Model"].tolist()}

@app.get("/modification-types")
def modification_types(model: str):
    with sqlite3.connect(DB_PATH) as conn:
        mods = pd.read_sql("SELECT DISTINCT Modification_Type FROM Car_Modifications WHERE Model=?", conn, params=[model])
    return {"modification_types": mods["Modification_Type"].tolist()}

@app.get("/car-parts")
def car_parts(model: str):
    with sqlite3.connect(DB_PATH) as conn:
        parts = pd.read_sql("SELECT DISTINCT Car_Part FROM Car_Modifications WHERE Model=?", conn, params=[model])
    return {"parts": parts["Car_Part"].tolist()}

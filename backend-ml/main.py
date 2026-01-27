from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import datetime

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Cargar modelo y columnas
model = joblib.load("modelo_colores.pkl")
model_columns = joblib.load("columnas_modelo.pkl")

class EventRequest(BaseModel):
    event: str

@app.post("/predict")
def predict(data: EventRequest):
    now = datetime.datetime.now()
    evento_nombre = data.event.lower().strip()
    
    try:
        # Predicción base de tu modelo
        input_df = pd.DataFrame(0, index=[0], columns=model_columns)
        if 'mes' in input_df.columns: input_df['mes'] = now.month
        col_evento = f"evento_{evento_nombre}"
        if col_evento in input_df.columns: input_df[col_evento] = 1
        
        pred = model.predict(input_df)[0]
        base_r, base_g, base_b, base_brillo = int(pred[0]), int(pred[1]), int(pred[2]), int(pred[3])

        # --- LÓGICA DE EVENTOS PERSONALIZADOS ---
        
        # 1. ECUADOR (Selección, Partidos, Goles)
        if "ecuador" in evento_nombre or "seleccion" in evento_nombre:
            return {
                "is_multi_section": True,
                "sections": [
                    {"r": 255, "g": 220, "b": 0, "brillo": 100}, # Fa: Amarillo
                    {"r": 0, "g": 100, "b": 255, "brillo": 90},  # bL: Azul
                    {"r": 255, "g": 0, "b": 0, "brillo": 90}     # ab: Rojo
                ],
                "mode": "static"
            }

        # 2. NAVIDAD
        elif "navidad" in evento_nombre:
            return {
                "is_multi_section": True,
                "sections": [
                    {"r": 255, "g": 0, "b": 0, "brillo": base_brillo},   # Fa: Rojo
                    {"r": 0, "g": 255, "b": 0, "brillo": base_brillo},   # bL: Verde
                    {"r": 255, "g": 255, "b": 255, "brillo": base_brillo} # ab: Blanco
                ],
                "mode": "blink"
            }

        # 3. HALLOWEEN
        elif "halloween" in evento_nombre:
            return {
                "is_multi_section": True,
                "sections": [
                    {"r": 255, "g": 100, "b": 0, "brillo": 100}, # Fa: Naranja
                    {"r": 0, "g": 0, "b": 0, "brillo": 50},      # bL: Negro (Apagado tenue)
                    {"r": 130, "g": 0, "b": 255, "brillo": 100}  # ab: Morado
                ],
                "mode": "gradient"
            }

        # 4. FUNDACIÓN DE QUITO (Azul y Rojo)
        elif "quito" in evento_nombre:
            return {
                "is_multi_section": True,
                "sections": [
                    {"r": 0, "g": 50, "b": 255, "brillo": 100},  # Fa: Azul
                    {"r": 255, "g": 0, "b": 0, "brillo": 100},   # bL: Rojo
                    {"r": 0, "g": 50, "b": 255, "brillo": 100}   # ab: Azul
                ],
                "mode": "static"
            }

        # 5. CARNAVAL (Multicolor brillante)
        elif "carnaval" in evento_nombre:
            return {
                "is_multi_section": True,
                "sections": [
                    {"r": 255, "g": 0, "b": 200, "brillo": 100}, # Fa: Rosa
                    {"r": 0, "g": 255, "b": 255, "brillo": 100}, # bL: Cian
                    {"r": 255, "g": 255, "b": 0, "brillo": 100}  # ab: Amarillo
                ],
                "mode": "rainbow"
            }

        # 6. DEFAULT (Variación tonal de la predicción IA)
        # Esto hace que las 3 letras se vean relacionadas pero con matices distintos
        else:
            return {
                "is_multi_section": True,
                "sections": [
                    {"r": base_r, "g": base_g, "b": base_b, "brillo": base_brillo},
                    {"r": max(0, base_r - 30), "g": base_g, "b": min(255, base_b + 30), "brillo": base_brillo},
                    {"r": min(255, base_r + 30), "g": max(0, base_g - 30), "b": base_b, "brillo": base_brillo}
                ],
                "mode": "static"
            }

    except Exception as e:
        return {"error": str(e)}
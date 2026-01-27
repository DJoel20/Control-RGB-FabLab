import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Cargar y limpiar
data = pd.read_csv("dataset.csv")
data.columns = data.columns.str.strip()
data["evento"] = data["evento"].str.lower().str.strip()

# One-Hot Encoding
data_encoded = pd.get_dummies(data, columns=["evento", "modo"])

# Definir X e y
X = data_encoded.drop(["r", "g", "b", "brillo"], axis=1)
y = data[["r", "g", "b", "brillo"]]

# Entrenar modelo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Guardar archivos
joblib.dump(model, "modelo_colores.pkl")
joblib.dump(X.columns.tolist(), "columnas_modelo.pkl")
print("✅ Entrenamiento completado: modelo_colores.pkl y columnas_modelo.pkl generados.")
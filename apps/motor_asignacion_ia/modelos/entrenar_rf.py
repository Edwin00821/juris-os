import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

def entrenar_modelo():
    print("Iniciando el entrenamiento del modelo Random Forest...")

    # 1. Definir rutas (para que funcione desde cualquier lugar)
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_csv = os.path.join(directorio_actual, '..', 'data', 'dataset_historico_simulado.csv')
    ruta_modelo = os.path.join(directorio_actual, 'random_forest_jueces.pkl')

    # 2. Cargar los datos
    if not os.path.exists(ruta_csv):
        print(f"Error: No se encontró el dataset en {ruta_csv}")
        return

    df = pd.read_csv(ruta_csv)

    # 3. Preparar los datos (Features X y Target Y)
    # Solo usamos columnas numéricas que la IA pueda entender
    X = df[['complejidad_caso', 'carga_trabajo_juez_pct', 'especialidad_coincide']]
    y = df['tiempo_resolucion_dias']

    # 4. Dividir en datos de entrenamiento (80%) y prueba (20%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 5. Configurar y Entrenar el Random Forest
    # n_estimators=100 significa que creará 100 árboles de decisión
    modelo_rf = RandomForestRegressor(n_estimators=100, random_state=42)
    modelo_rf.fit(X_train, y_train)

    # 6. Evaluar qué tan bien aprendió (usando los datos de prueba)
    predicciones = modelo_rf.predict(X_test)
    mae = mean_absolute_error(y_test, predicciones)
    rmse = mean_squared_error(y_test, predicciones) ** 0.5

    print("\n--- Resultados de la Evaluación ---")
    print(f"Margen de Error Absoluto (MAE): +/- {mae:.2f} días")
    print(f"Raíz del Error Cuadrático Medio (RMSE): {rmse:.2f} días")
    print("-----------------------------------\n")

    # 7. Guardar el modelo listo para producción
    joblib.dump(modelo_rf, ruta_modelo)
    print(f"¡Modelo guardado exitosamente en: {ruta_modelo}!")

if __name__ == "__main__":
    entrenar_modelo()
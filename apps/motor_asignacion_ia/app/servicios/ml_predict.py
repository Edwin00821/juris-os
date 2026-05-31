import joblib
import os
import pandas as pd

# 1. Cargar el modelo al iniciar el servicio (Singleton)
directorio_actual = os.path.dirname(os.path.abspath(__file__))
ruta_modelo = os.path.join(directorio_actual, '..', '..', 'modelos', 'random_forest_jueces.pkl')

try:
    modelo_rf = joblib.load(ruta_modelo)
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    modelo_rf = None

def predecir_tiempo_resolucion(complejidad, carga_pct, especialidad_coincide):
    """
    Usa el modelo Random Forest para predecir los días de resolución.
    """
    if modelo_rf is None:
        return 0.0
    
    # Crear un DataFrame con el mismo formato que el entrenamiento
    input_data = pd.DataFrame([{
        'complejidad_caso': complejidad,
        'carga_trabajo_juez_pct': carga_pct,
        'especialidad_coincide': 1 if especialidad_coincide else 0
    }])
    
    # Realizar la predicción
    prediccion = modelo_rf.predict(input_data)
    
    return round(prediccion[0], 2)

def obtener_mejor_asignacion_hibrida(candidatos_heuristica, caso_nuevo):
    """
    Toma los mejores candidatos de la heurística y los refina con IA.
    """
    resultado_hibrido = []
    
    for cand in candidatos_heuristica:
        # Extraer datos necesarios para la IA
        especialidad_coincide = "coincide" in cand['justificacion']
        
        # Predecir tiempo con el Random Forest
        tiempo_estimado = predecir_tiempo_resolucion(
            complejidad=caso_nuevo.get('complejidad', 3), # Default 3
            carga_pct=float(cand['justificacion'].split(': ')[1].replace('%', '')),
            especialidad_coincide=especialidad_coincide
        )
        
        # Combinar datos
        resultado_hibrido.append({
            **cand,
            'tiempo_estimado_dias': tiempo_estimado
        })
    
    # El ganador final es el que tenga el mejor score Y el menor tiempo estimado
    # Aquí podríamos usar otra fórmula, por ahora devolvemos la lista enriquecida
    return sorted(resultado_hibrido, key=lambda x: (x['score_idoneidad'], -x['tiempo_estimado_dias']), reverse=True)
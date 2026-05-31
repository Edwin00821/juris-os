# Inteligencia Artificial - Selección de Juez

Al ser un problema de optimizacion y recomendacion, podemos abordarlo con un **Enfoque de Machine Learning**: Sistema de Puntuación Ponderada + Random Forest

## Parametros

### Parámetros del Caso (Contexto de Entrada):

- Categoría del Asunto: Rama legal (Derechos Civiles, Finanzas, Laboral).
- Entidades Involucradas: Nombres o IDs de las empresas/personas demandadas (ej. "Global Net Protocol").
- Complejidad Estimada: Un valor numérico (1-5) derivado de la cantidad de documentos o el monto demandado.
- Prioridad: Urgente o Estándar.

### Parámetros del Juez (Perfil y Estado):

- Especialidad Principal: Compatibilidad binaria o porcentual con la Categoría del Asunto.
- Carga de Trabajo Actual (%): Cuántos casos activos tiene vs. su capacidad máxima.
- Historial de Éxito / Resolución: Porcentaje histórico de casos resueltos en la categoría específica del caso.
- Experiencia Específica con la Entidad: Cuántos casos ha manejado previamente donde participa el demandado actual (esto alimenta el texto de justificación que pusiste en el diseño).
- Tiempo de Respuesta Promedio (Días): Velocidad histórica de resolución del juez para la categoría en cuestión.

## Estructura del Proyecto

```text
/motor_asignacion_ia
├── /app
│   ├── /api
│   │   └── endpoints.py                # Definición de rutas y controladores
│   ├── /core
│   │   └── config.py                   # Configuración y variables de entorno
│   ├── /db
│   │   └── database.py                 # Gestión de conexión PostgreSQL
│   ├── /servicios
│   │   ├── heuristica.py               # Lógica de puntuación ponderada
│   │   └── ml_predict.py               # Inferencia del modelo ML
│   └── main.py                         # Punto de entrada FastAPI
├── /data
│   └── dataset_historico_simulado.csv  # Datos para entrenar tu modelo generados por generar_dataset.py
├── /modelos
│   ├── entrenar_rf.py                  # Entrenar el modelo Random Forest
│   └── random_forest_jueces.pkl        # Modelo entrenado (Random Forest)
├── generar_dataset.py                  # Crear valores aleatorios para entrenar el modelo y los guarda en data/dataset_historico_simulado.csv
├── pruebas # Carpeta con ejemplos .json para probar en FastAPI
│   ├── scripts_pruebas.txt           # Descripción de los casos de prueba
│   ├── script_prueba.json            # Prueba sencilla para verificar la funcionalidad
│   ├── script_prueba1.json           # El Dilema Penal (Alta Complejidad)
│   ├── script_prueba2.json           # Competencia Comercial (Desempate)
│   └── script_prueba3.json           # Crisis en el Tribunal (Caso Extremo)
├── README.md                           # Documentación general
└── requirements.txt                    # Dependencias del proyecto
```
 
## 🚀 Tecnologías Utilizadas

- **Pandas**: Para manipular los datos tabulares extraídos de la base de datos.
- **Scikit-Learn (sklearn)**: La librería estándar de Python donde ya viene programado el algoritmo de Random Forest. No tienes que programar la matemática del bosque desde cero, solo saber implementarlo y ajustarlo.
- **SQLAlchemy o SQLModel**: Para conectarte a tu base de datos PostgreSQL desde Python y extraer los datos de forma segura.
- **FastAPI**: Para exponer tu algoritmo. El frontend en React le enviará un JSON con los datos del caso nuevo a FastAPI, y FastAPI le devolverá el ID del mejor juez.

## Como se fue trabajando (flujo de trabajo)

1. `requirements.txt` -> Se fueron instalando las dependencias del proyecto
2. `generar_dataset.py` -> Genera un dataset simulado de casos legales para entrenar el modelo y lo guarda en `dataset_historico_simulado.csv`
3. `dataset_historico_simulado.csv` -> Dataset simulado de casos legales para entrenar el modelo
4. `servicios\heuristica.py` -> Define la heuristica con la logica y reglas de negocio necesarias para evaluar a cada juez para cada caso, genera una puntuacion inicial para cada juez
5. `modelos\entrenar_rf.py` -> Entrena el modelo Random Forest con el dataset simulado y lo guarda en `modelos\random_forest_jueces.pkl`
6. `random_forest_jueces.pkl` -> Modelo entrenado (Random Forest)
7. `servicios\ml_predict.py` -> Carga el modelo de Machine Learning ya entrenado (.pkl) y realiza predicciones (inferencia) sobre el tiempo estimado de resolución. Combina estos resultados con el filtro de la heurística para devolver una lista híbrida y refinada con la mejor opción de juez.
8. `main.py` -> Punto de entrada principal de la API utilizando FastAPI. Define las rutas (endpoints como /api/v1/asignar-juez) que reciben las peticiones del frontend en React, procesan los datos a través del motor híbrido y devuelven el resultado final en formato JSON.

## Como ejecutar

Desde una terminal en la carpeta raiz del proyecto:

```bash
uvicorn ia.motor_asignacion_ia.app.main:app --reload
```
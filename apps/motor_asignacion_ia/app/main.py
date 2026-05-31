from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # 1. Importamos el middleware necesario
from pydantic import BaseModel
from typing import List
from .servicios.heuristica import sugerir_jueces_heuristica
from .servicios.ml_predict import obtener_mejor_asignacion_hibrida

app = FastAPI(title="Motor de Justicia Soberana IA")

# Configuración de CORS añadida justo después de instanciar la app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite recibir solicitudes de cualquier origen externo (como Vercel)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

# Definición de Schemas (Pydantic)
class CasoInput(BaseModel):
    id_caso: str
    categoria_caso: str
    complejidad: int # 1 a 5

class JuezInput(BaseModel):
    id: str
    nombre: str
    especialidad: str
    carga_trabajo_pct: float

@app.get("/")
def read_root():
    return {"status": "online", "mensaje": "Motor de Asignación Judicial Activo"}

@app.post("/api/v1/asignar-juez")
def asignar_juez(caso: CasoInput, jueces: List[JuezInput]):
    # 1. Convertir Pydantic a Diccionarios para nuestros servicios
    jueces_list = [j.dict() for j in jueces]
    caso_dict = caso.dict()
    
    # 2. Paso 1: Filtro Heurístico (Reglas de Negocio)
    candidatos = sugerir_jueces_heuristica(jueces_list, caso_dict)
    
    if not candidatos:
        raise HTTPException(status_code=404, detail="No se encontraron jueces disponibles con carga aceptable.")
    
    # 3. Paso 2: Refinamiento con IA (Predicción de Tiempo)
    propuesta_final = obtener_mejor_asignacion_hibrida(candidatos, caso_dict)
    
    return {
        "caso_id": caso.id_caso,
        "ganador": propuesta_final[0],
        "alternativas": propuesta_final[1:]
    }
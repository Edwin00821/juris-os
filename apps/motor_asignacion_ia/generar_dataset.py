import pandas as pd
import numpy as np
from faker import Faker
import random
import os 

# Prueba de VS Code con Linux
# Prueba de VS Code con Windows
# Prueba de Antigravity con Windows

# Inicializar Faker para datos aleatorios realistas
fake = Faker('es_MX') 

# Variables extraídas del dominio del proyecto
CATEGORIAS_LEGALES = [
    'Derechos Civiles', 
    'Justicia Penal', 
    'Tribunal de Familia', 
    'Disputas Comerciales', 
    'Privacidad y Tecnología'
]

JUECES = [
    {'id': 'J-001', 'nombre': 'Hon. Elena Jacobs', 'especialidad': 'Derechos Civiles'},
    {'id': 'J-002', 'nombre': 'Hon. Marcus Wright', 'especialidad': 'Justicia Penal'},
    {'id': 'J-003', 'nombre': 'Hon. Sophia Chen', 'especialidad': 'Disputas Comerciales'},
    {'id': 'J-004', 'nombre': 'Hon. David Miller', 'especialidad': 'Tribunal de Familia'},
    {'id': 'J-005', 'nombre': 'Hon. Alistair Thorne', 'especialidad': 'Privacidad y Tecnología'}
]

def generar_datos_simulados(num_casos=5000):
    datos = []
    
    for _ in range(num_casos):
        # 1. Parámetros del Caso
        id_caso = f"EXP-{fake.unique.random_int(min=10000, max=99999)}"
        categoria_caso = random.choice(CATEGORIAS_LEGALES)
        complejidad_caso = random.randint(1, 5) # 1: Sencillo, 5: Muy complejo
        
        # 2. Asignación aleatoria a un juez (simulando el histórico)
        juez = random.choice(JUECES)
        
        # 3. Estado del Juez al momento de recibir el caso
        carga_trabajo_actual = round(random.uniform(10.0, 95.0), 2) # Porcentaje de carga
        especialidad_coincide = 1 if juez['especialidad'] == categoria_caso else 0
        
        # 4. LÓGICA DEL MUNDO REAL: Calcular el tiempo de resolución (Nuestra variable Y)
        # Empezamos con un tiempo base aleatorio entre 10 y 30 días
        tiempo_resolucion = random.randint(10, 30)
        
        # Aumenta drásticamente por la complejidad
        tiempo_resolucion += (complejidad_caso * 15)
        
        # Aumenta si el juez está saturado de trabajo
        if carga_trabajo_actual > 75.0:
            tiempo_resolucion += random.randint(20, 45)
            
        # Disminuye si el caso es de la especialidad del juez (es experto)
        if especialidad_coincide == 1:
            tiempo_resolucion -= random.randint(10, 25)
        else:
            # Penalización severa por no ser su área
            tiempo_resolucion += random.randint(30, 60)
            
        # Asegurarse de que el tiempo no sea negativo por los cálculos
        tiempo_resolucion = max(5, tiempo_resolucion)
        
        datos.append({
            'id_caso': id_caso,
            'categoria_caso': categoria_caso,
            'complejidad_caso': complejidad_caso,
            'id_juez': juez['id'],
            'carga_trabajo_juez_pct': carga_trabajo_actual,
            'especialidad_coincide': especialidad_coincide,
            'tiempo_resolucion_dias': tiempo_resolucion
        })
        
    return pd.DataFrame(datos)

if __name__ == "__main__":
    print("Generando dataset histórico simulado...")
    df_simulado = generar_datos_simulados(5000)
    
    # 1. Obtener la ruta exacta de la carpeta donde está guardado ESTE script
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    
    # 2. Construir la ruta hacia la carpeta 'data' que está al lado de este script
    carpeta_data = os.path.join(directorio_actual, 'data')
    
    # Crear carpeta /data si no existe en esa ruta específica
    os.makedirs(carpeta_data, exist_ok=True)
    
    ''' Guardar en CSV en la ruta: ia\motor_asignacion_ia\data\dataset_historico_simulado.csv'''
    ruta_archivo = os.path.join(carpeta_data, 'dataset_historico_simulado.csv')
    df_simulado.to_csv(ruta_archivo, index=False)
    
    print(f"Dataset generado con éxito en: {ruta_archivo}")
    print(df_simulado.head())
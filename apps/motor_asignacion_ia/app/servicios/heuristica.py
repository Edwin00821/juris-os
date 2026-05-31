def calcular_score_juez(juez, caso):
    """
    Calcula un puntaje del 0 al 100 para un juez dado un caso específico.
    """
    # 1. FILTRO DURO: Si el juez tiene más de 90% de carga, no se le asigna nada nuevo (Score = 0)
    if juez['carga_trabajo_pct'] > 90.0:
        return 0.0

    # 2. DEFINIR PESOS (Heuristica): 
    # Le damos 60% de importancia a la especialidad y 40% a qué tan desocupado está.
    peso_especialidad = 0.6
    peso_disponibilidad = 0.4

    # 3. CALCULAR PUNTOS
    # Si la especialidad coincide, gana 100 puntos en este rubro. Si no, 0.
    puntaje_especialidad = 100.0 if juez['especialidad'] == caso['categoria_caso'] else 0.0
    
    # Su disponibilidad es el inverso de su carga (Ej: 20% de carga = 80 puntos de disponibilidad)
    puntaje_disponibilidad = 100.0 - juez['carga_trabajo_pct']

    # 4. CALCULO FINAL
    score_final = (puntaje_especialidad * peso_especialidad) + (puntaje_disponibilidad * peso_disponibilidad)
    
    return round(score_final, 2)

def sugerir_jueces_heuristica(jueces_disponibles, caso_nuevo):
    """
    Evalúa a una lista de jueces y los ordena del mejor al peor candidato.
    """
    resultados = []
    
    for juez in jueces_disponibles:
        score = calcular_score_juez(juez, caso_nuevo)
        
        # Solo consideramos a los que pasaron el filtro duro (Score > 0)
        if score > 0:
            resultados.append({
                'id_juez': juez['id'],
                'nombre': juez['nombre'],
                'score_idoneidad': score,
                'justificacion': f"Especialidad {'coincide' if juez['especialidad'] == caso_nuevo['categoria_caso'] else 'difiere'}. Carga actual: {juez['carga_trabajo_pct']}%"
            })
    
    # Ordenar la lista de mayor a menor score
    resultados_ordenados = sorted(resultados, key=lambda x: x['score_idoneidad'], reverse=True)
    
    return resultados_ordenados

# ==========================================
# BLOQUE DE PRUEBA (Para verificar que funciona)
# ==========================================
if __name__ == "__main__":
    # Simulamos los jueces que el backend de Node/React nos enviaría
    jueces_en_base_de_datos = [
        {'id': 'J-001', 'nombre': 'Hon. Elena Jacobs', 'especialidad': 'Derechos Civiles', 'carga_trabajo_pct': 45.0},
        {'id': 'J-002', 'nombre': 'Hon. Marcus Wright', 'especialidad': 'Justicia Penal', 'carga_trabajo_pct': 92.0}, # Saturado
        {'id': 'J-003', 'nombre': 'Hon. Sophia Chen', 'especialidad': 'Disputas Comerciales', 'carga_trabajo_pct': 10.0},
        {'id': 'J-004', 'nombre': 'Hon. David Miller', 'especialidad': 'Tribunal de Familia', 'carga_trabajo_pct': 30.0},
        {'id': 'J-005', 'nombre': 'Hon. Alistair Thorne', 'especialidad': 'Privacidad y Tecnología', 'carga_trabajo_pct': 65.0}
    ]

    # Simulamos un caso nuevo que acaba de entrar al sistema
    nuevo_caso = {
        'id_caso': 'EXP-NUEVO-001',
        'categoria_caso': 'Tribunal de Familia'
    }

    print(f"--- Evaluando Asignación para Caso: {nuevo_caso['categoria_caso']} ---")
    sugerencias = sugerir_jueces_heuristica(jueces_en_base_de_datos, nuevo_caso)
    
    for i, sugerencia in enumerate(sugerencias):
        print(f"{i+1}. {sugerencia['nombre']} (Score: {sugerencia['score_idoneidad']}) -> {sugerencia['justificacion']}")
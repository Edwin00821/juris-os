"""Unit tests for the Random Forest hybrid inference layer (FR4).

The ML layer lives in ``app/servicios/ml_predict.py``. It has two public
functions, both with Spanish names/keys (existing code); these tests document
and verify the behaviour in English:

    - ``predecir_tiempo_resolucion(complejidad, carga_pct, especialidad_coincide)``
      runs the trained ``.pkl`` model and returns the estimated resolution time
      in days, rounded to 2 decimals (0.0 if the model failed to load).
    - ``obtener_mejor_asignacion_hibrida(candidatos, caso)`` takes the heuristic's
      ranked candidates, enriches each with ``tiempo_estimado_dias``, and re-ranks
      by (score desc, estimated-time asc).

The model is loaded once at import time. The shape/behaviour tests below use the
real ``.pkl``; the parsing/sorting tests stub the predictor so they assert the
orchestration logic independently of the model's exact numbers.
"""

import pytest

from app.servicios import ml_predict
from app.servicios.ml_predict import (
    obtener_mejor_asignacion_hibrida,
    predecir_tiempo_resolucion,
)


def make_candidate(judge_id="J-001", name="Hon. Test", score=88.0, matches=True, workload=30.0):
    """Build a candidate in the exact shape produced by the heuristic.

    ``obtener_mejor_asignacion_hibrida`` reads two things out of ``justificacion``:
    whether the specialty matches (substring ``"coincide"``) and the workload
    percentage (after ``": "`` and before ``"%"``), so the string must follow the
    heuristic's format.
    """
    estado = "coincide" if matches else "difiere"
    return {
        "id_juez": judge_id,
        "nombre": name,
        "score_idoneidad": score,
        "justificacion": f"Especialidad {estado}. Carga actual: {workload}%",
    }


class TestPredecirTiempoResolucion:
    """Single prediction: ``predecir_tiempo_resolucion`` against the real model."""

    def test_returns_a_positive_float_rounded_to_two_decimals(self):
        dias = predecir_tiempo_resolucion(complejidad=4, carga_pct=30.0, especialidad_coincide=True)
        assert isinstance(dias, float)
        assert dias > 0
        assert round(dias, 2) == dias

    def test_specialty_match_resolves_faster_than_mismatch(self):
        # The model learned that a matching specialty shortens resolution time;
        # holding complexity and workload constant, a match must not be slower.
        match = predecir_tiempo_resolucion(complejidad=4, carga_pct=30.0, especialidad_coincide=True)
        mismatch = predecir_tiempo_resolucion(complejidad=4, carga_pct=30.0, especialidad_coincide=False)
        assert match < mismatch

    def test_predictions_are_deterministic(self):
        first = predecir_tiempo_resolucion(complejidad=3, carga_pct=50.0, especialidad_coincide=True)
        second = predecir_tiempo_resolucion(complejidad=3, carga_pct=50.0, especialidad_coincide=True)
        assert first == second

    def test_returns_zero_when_model_failed_to_load(self, monkeypatch):
        # If the .pkl could not be loaded, the service degrades gracefully to 0.0
        # instead of raising.
        monkeypatch.setattr(ml_predict, "modelo_rf", None)
        assert predecir_tiempo_resolucion(complejidad=4, carga_pct=30.0, especialidad_coincide=True) == 0.0


class TestObtenerMejorAsignacionHibrida:
    """Hybrid re-ranking: ``obtener_mejor_asignacion_hibrida``."""

    def test_each_candidate_is_enriched_with_estimated_time(self):
        candidatos = [make_candidate("J-004", "Hon. David Miller")]
        result = obtener_mejor_asignacion_hibrida(candidatos, {"complejidad": 4})
        assert "tiempo_estimado_dias" in result[0]
        # Original heuristic fields are preserved.
        assert result[0]["id_juez"] == "J-004"
        assert result[0]["score_idoneidad"] == 88.0

    def test_empty_candidate_list_returns_empty(self):
        assert obtener_mejor_asignacion_hibrida([], {"complejidad": 3}) == []

    def test_parses_match_flag_and_workload_from_justification(self, monkeypatch):
        # Stub the predictor to echo back what it was called with, so we can assert
        # the orchestrator parsed the justification string correctly.
        captured = {}

        def fake_predict(complejidad, carga_pct, especialidad_coincide):
            captured["complejidad"] = complejidad
            captured["carga_pct"] = carga_pct
            captured["especialidad_coincide"] = especialidad_coincide
            return 10.0

        monkeypatch.setattr(ml_predict, "predecir_tiempo_resolucion", fake_predict)
        candidatos = [make_candidate(matches=True, workload=42.5)]
        obtener_mejor_asignacion_hibrida(candidatos, {"complejidad": 5})

        assert captured["complejidad"] == 5
        assert captured["carga_pct"] == 42.5
        assert captured["especialidad_coincide"] is True

    def test_uses_default_complexity_3_when_case_omits_it(self, monkeypatch):
        captured = {}
        monkeypatch.setattr(
            ml_predict,
            "predecir_tiempo_resolucion",
            lambda complejidad, carga_pct, especialidad_coincide: captured.update(
                complejidad=complejidad
            )
            or 1.0,
        )
        obtener_mejor_asignacion_hibrida([make_candidate()], {})
        assert captured["complejidad"] == 3

    def test_ties_on_score_break_toward_lower_estimated_time(self, monkeypatch):
        # Two judges with the same idoneidad score; the faster estimated resolution
        # must rank first.
        def fake_predict(complejidad, carga_pct, especialidad_coincide):
            # carga_pct uniquely identifies each candidate here.
            return 20.0 if carga_pct == 10.0 else 80.0

        monkeypatch.setattr(ml_predict, "predecir_tiempo_resolucion", fake_predict)
        candidatos = [
            make_candidate("J-SLOW", score=88.0, workload=50.0),
            make_candidate("J-FAST", score=88.0, workload=10.0),
        ]
        result = obtener_mejor_asignacion_hibrida(candidatos, {"complejidad": 4})
        assert [r["id_juez"] for r in result] == ["J-FAST", "J-SLOW"]

    def test_higher_score_ranks_first_regardless_of_time(self, monkeypatch):
        monkeypatch.setattr(
            ml_predict,
            "predecir_tiempo_resolucion",
            lambda complejidad, carga_pct, especialidad_coincide: 5.0,
        )
        candidatos = [
            make_candidate("J-LOW", score=40.0, workload=10.0),
            make_candidate("J-HIGH", score=88.0, workload=20.0),
        ]
        result = obtener_mejor_asignacion_hibrida(candidatos, {"complejidad": 4})
        assert result[0]["id_juez"] == "J-HIGH"

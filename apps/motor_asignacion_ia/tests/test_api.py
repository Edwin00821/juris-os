"""Integration tests for the FastAPI assignment endpoint (FR4).

Exercises ``POST /api/v1/asignar-juez`` end-to-end through FastAPI's
``TestClient``: request validation, the heuristic filter, the Random Forest
refinement, and the final response shape. The four scenarios under
``pruebas/*.json`` are replayed as the real payloads the Node/React backend
sends, plus a few edge cases for error handling.
"""

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

PRUEBAS_DIR = Path(__file__).resolve().parent.parent / "pruebas"
ENDPOINT = "/api/v1/asignar-juez"

client = TestClient(app)


def load_scenario(filename):
    return json.loads((PRUEBAS_DIR / filename).read_text(encoding="utf-8"))


class TestHealthCheck:
    def test_root_reports_online(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "online"


class TestAsignarJuezScenarios:
    """Replay the four canned scenarios from ``pruebas/*.json``."""

    @pytest.mark.parametrize(
        "filename",
        [
            "script_prueba.json",
            "script_prueba1.json",
            "script_prueba2.json",
            "script_prueba3.json",
        ],
    )
    def test_scenario_returns_a_well_formed_proposal(self, filename):
        payload = load_scenario(filename)
        response = client.post(ENDPOINT, json=payload)

        assert response.status_code == 200
        body = response.json()
        # Echoes the case id and exposes a winner plus alternatives.
        assert body["caso_id"] == payload["caso"]["id_caso"]
        assert "ganador" in body and body["ganador"] is not None
        assert "alternativas" in body and isinstance(body["alternativas"], list)

        ganador = body["ganador"]
        assert {"id_juez", "score_idoneidad", "tiempo_estimado_dias"} <= ganador.keys()

    def test_winner_is_the_specialist_with_low_workload(self):
        # script_prueba.json: only J-004 (Familiar) matches the Familiar case and
        # is well below the workload cap, so it must win.
        payload = load_scenario("script_prueba.json")
        body = client.post(ENDPOINT, json=payload).json()
        assert body["ganador"]["id_juez"] == "J-004"

    def test_overloaded_judges_are_excluded_from_results(self):
        # script_prueba1.json: J-008 (Penal, 95%) is over the 90% cap and must not
        # appear anywhere in the proposal.
        payload = load_scenario("script_prueba1.json")
        body = client.post(ENDPOINT, json=payload).json()
        returned_ids = [body["ganador"]["id_juez"]] + [
            alt["id_juez"] for alt in body["alternativas"]
        ]
        assert "J-008" not in returned_ids

    def test_winner_outranks_every_alternative(self):
        payload = load_scenario("script_prueba1.json")
        body = client.post(ENDPOINT, json=payload).json()
        winner_score = body["ganador"]["score_idoneidad"]
        assert all(winner_score >= alt["score_idoneidad"] for alt in body["alternativas"])

    def test_falls_back_to_available_non_specialists_when_specialists_saturated(self):
        # script_prueba3.json: every Familiar judge is above 90% workload, so the
        # winner is a non-matching but available judge rather than a 404.
        payload = load_scenario("script_prueba3.json")
        response = client.post(ENDPOINT, json=payload)
        assert response.status_code == 200
        winner_id = response.json()["ganador"]["id_juez"]
        saturated_specialists = {"J-001", "J-007", "J-014", "J-015"}
        assert winner_id not in saturated_specialists


class TestAsignarJuezErrors:
    def test_returns_404_when_all_judges_are_overloaded(self):
        payload = {
            "caso": {"id_caso": "EXP-EMPTY", "categoria_caso": "Familiar", "complejidad": 3},
            "jueces": [
                {"id": "J-A", "nombre": "Hon. A", "especialidad": "Familiar", "carga_trabajo_pct": 95.0},
                {"id": "J-B", "nombre": "Hon. B", "especialidad": "Penal", "carga_trabajo_pct": 99.0},
            ],
        }
        response = client.post(ENDPOINT, json=payload)
        assert response.status_code == 404

    def test_rejects_payload_missing_required_case_fields(self):
        payload = {
            "caso": {"id_caso": "EXP-BAD"},  # missing categoria_caso + complejidad
            "jueces": [
                {"id": "J-A", "nombre": "Hon. A", "especialidad": "Familiar", "carga_trabajo_pct": 30.0}
            ],
        }
        response = client.post(ENDPOINT, json=payload)
        assert response.status_code == 422

    def test_rejects_non_numeric_workload(self):
        payload = {
            "caso": {"id_caso": "EXP-BAD", "categoria_caso": "Familiar", "complejidad": 3},
            "jueces": [
                {"id": "J-A", "nombre": "Hon. A", "especialidad": "Familiar", "carga_trabajo_pct": "heavy"}
            ],
        }
        response = client.post(ENDPOINT, json=payload)
        assert response.status_code == 422

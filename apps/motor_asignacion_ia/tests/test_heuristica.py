"""Unit tests for the weighted-scoring heuristic (FR4: intelligent case assignment).

The heuristic lives in ``app/servicios/heuristica.py``. Its public functions and
data keys are in Spanish (existing code); these tests document and verify the
business rules in English.

Scoring rule under test:
    - Hard filter: workload > 90% -> score 0 (judge is excluded).
    - Weighted score = specialty(0..100) * 0.6 + availability(0..100) * 0.4
      where specialty = 100 if judge specialty matches the case category else 0,
      and availability = 100 - workload_pct.
"""

import pytest

from app.servicios.heuristica import calcular_score_juez, sugerir_jueces_heuristica


def make_judge(judge_id="J-001", name="Hon. Test", specialty="Family Court", workload=45.0):
    """Build a judge dict using the keys the heuristic expects."""
    return {
        "id": judge_id,
        "nombre": name,
        "especialidad": specialty,
        "carga_trabajo_pct": workload,
    }


def make_case(category="Family Court"):
    return {"id_caso": "EXP-TEST-001", "categoria_caso": category}


class TestCalcularScoreJuez:
    """Single-judge scoring: ``calcular_score_juez``."""

    def test_specialty_match_applies_60_40_weighting(self):
        # specialty=100*0.6=60, availability=(100-45)*0.4=22 -> 82.0
        score = calcular_score_juez(make_judge(workload=45.0), make_case())
        assert score == 82.0

    def test_specialty_mismatch_scores_only_availability(self):
        # specialty=0, availability=(100-10)*0.4=36 -> 36.0
        judge = make_judge(specialty="Criminal Justice", workload=10.0)
        score = calcular_score_juez(judge, make_case(category="Family Court"))
        assert score == 36.0

    def test_hard_filter_excludes_overloaded_judge(self):
        # workload strictly above 90% -> excluded regardless of specialty match.
        score = calcular_score_juez(make_judge(workload=92.0), make_case())
        assert score == 0.0

    def test_boundary_exactly_90_percent_still_scored(self):
        # 90.0 is NOT greater than 90.0, so the judge passes the filter.
        # specialty match: 60 + (100-90)*0.4 = 64.0
        score = calcular_score_juez(make_judge(workload=90.0), make_case())
        assert score == 64.0

    def test_boundary_just_above_90_percent_excluded(self):
        score = calcular_score_juez(make_judge(workload=90.01), make_case())
        assert score == 0.0

    def test_score_is_rounded_to_two_decimals(self):
        # availability=(100-33.333)*0.4=26.6668 -> rounded 26.67 (specialty mismatch)
        judge = make_judge(specialty="Criminal Justice", workload=33.333)
        score = calcular_score_juez(judge, make_case())
        assert score == 26.67


class TestSugerirJuecesHeuristica:
    """Ranking of multiple judges: ``sugerir_jueces_heuristica``."""

    @pytest.fixture
    def judges(self):
        return [
            make_judge("J-001", "Hon. Elena Jacobs", "Civil Rights", 45.0),
            make_judge("J-002", "Hon. Marcus Wright", "Criminal Justice", 92.0),  # overloaded
            make_judge("J-003", "Hon. Sophia Chen", "Commercial Disputes", 10.0),
            make_judge("J-004", "Hon. David Miller", "Family Court", 30.0),
            make_judge("J-005", "Hon. Alistair Thorne", "Privacy & Tech", 65.0),
        ]

    def test_overloaded_judge_is_filtered_out(self, judges):
        result = sugerir_jueces_heuristica(judges, make_case(category="Family Court"))
        ids = [r["id_juez"] for r in result]
        assert "J-002" not in ids
        assert len(result) == 4

    def test_results_sorted_by_score_descending(self, judges):
        result = sugerir_jueces_heuristica(judges, make_case(category="Family Court"))
        scores = [r["score_idoneidad"] for r in result]
        assert scores == sorted(scores, reverse=True)

    def test_best_match_is_ranked_first(self, judges):
        # J-004 matches Family Court with low workload: 60 + (100-30)*0.4 = 88.0
        result = sugerir_jueces_heuristica(judges, make_case(category="Family Court"))
        assert result[0]["id_juez"] == "J-004"
        assert result[0]["score_idoneidad"] == 88.0

    def test_each_result_includes_a_justification(self, judges):
        result = sugerir_jueces_heuristica(judges, make_case(category="Family Court"))
        assert all(r["justificacion"] for r in result)
        assert "coincide" in result[0]["justificacion"]  # top judge matches specialty

    def test_empty_judge_list_returns_empty(self):
        assert sugerir_jueces_heuristica([], make_case()) == []

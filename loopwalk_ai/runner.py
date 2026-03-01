from langgraph.graph import StateGraph, END

from loopwalk_ai.graph.state import AgentState
from loopwalk_ai.graph.nodes import explanation_node, intent_node, scoring_node, select_best_route_node   # 👈 add scoring_node

# Import backend service
from backend.services.maps_service import (
    get_many_routes,
    get_routes_by_duration,
    enrich_route,
    enrich_with_crowd,
    enrich_with_safety,
)


# -------- helper: convert full route -> candidate --------
def build_candidate(route, idx, queries):
    leg = route["legs"][0]

    return {
        "route_id": idx,
        "summary": route.get("summary", f"Route {idx}"),
        "start_address": leg["start_address"],
        "end_address": leg["end_address"],
        "distance_m": leg["distance"]["value"],
        "duration_s": leg["duration"]["value"],
        "pois": route.get("enrichment", {}),
        "crowd_avg": route.get("crowd", {}).get("avg_density", 0),
        "crowd_max": route.get("crowd", {}).get("max_density", 0),
        "safety_avg": route.get("safety", {}).get("avg_risk", 0),
        "safety_max": route.get("safety", {}).get("max_risk", 0),
    }


# -------- build graph --------
def build_graph():
    builder = StateGraph(AgentState)

    builder.add_node("intent", intent_node)
    builder.add_node("score", scoring_node)
    builder.add_node("select", select_best_route_node)
    builder.add_node("explain", explanation_node)

    builder.set_entry_point("intent")

    builder.add_edge("intent", "score")
    builder.add_edge("score", "select")
    builder.add_edge("select", "explain")
    builder.add_edge("explain", END)

    return builder.compile()

def run_agent(
    origin: str,
    destination: str,
    user_query: str,
    enrichment_queries: list[str],
):
    """
    Full agent execution pipeline.
    Returns:
        final_agent_state,
        enriched_routes (full Google objects)
    """

    # 1️⃣ fetch routes
    routes = get_many_routes(origin, destination, num_variations=3)

    enriched_routes = []

    for r in routes:
        r = enrich_route(r, enrichment_queries)
        r = enrich_with_crowd(r)
        r = enrich_with_safety(r)
        enriched_routes.append(r)

    # 2️⃣ convert to candidates
    candidates = [
        build_candidate(r, idx, enrichment_queries)
        for idx, r in enumerate(enriched_routes)
    ]

    # 3️⃣ initial state
    state: AgentState = {
        "origin": origin,
        "destination": destination,
        "query": user_query,
        "routes": candidates,
        "preferences": None,
        "route_scores": None,
        "chosen_route_id": None,
        "explanation": None,
    }

    # 4️⃣ run graph
    graph = build_graph()
    output = graph.invoke(state)

    return output, enriched_routes

def run_agent_by_duration(
    origin: str,
    minutes: int,
    user_query: str,
    enrichment_queries: list[str],
    num_variations: int = 8,
):
    """
    Agent pipeline for time-based walking routes.
    Returns:
        final_agent_state,
        enriched_routes
    """

    # 1️⃣ fetch candidate routes from duration boundary
    routes = get_routes_by_duration(origin, minutes, num_variations)

    enriched_routes = []

    for r in routes:
        r = enrich_route(r, enrichment_queries)
        r = enrich_with_crowd(r)
        r = enrich_with_safety(r)
        enriched_routes.append(r)

    # 2️⃣ convert to candidates
    candidates = [
        build_candidate(r, idx, enrichment_queries)
        for idx, r in enumerate(enriched_routes)
    ]

    # 3️⃣ initial state
    state: AgentState = {
        "origin": origin,
        "destination": f"{minutes}-minute walk",
        "query": user_query,
        "routes": candidates,
        "preferences": None,
        "route_scores": None,
        "chosen_route_id": None,
        "explanation": None,
    }

    # 4️⃣ run graph
    graph = build_graph()
    output = graph.invoke(state)

    return output, enriched_routes


# -------- test run --------
if __name__ == "__main__":
    # 1️⃣ fetch routes from backend
    routes = get_many_routes(
        "Millennium Park, Chicago",
        "Union Station, Chicago",
        num_variations=3,
    )

    enriched_routes = []
    queries = ["cafe"]

    for r in routes:
        r = enrich_route(r, queries)
        r = enrich_with_crowd(r)
        r = enrich_with_safety(r)
        enriched_routes.append(r)

    # 2️⃣ convert to agent candidates
    candidates = [
        build_candidate(r, idx, queries)
        for idx, r in enumerate(enriched_routes)
    ]

    # 3️⃣ initial state
    state: AgentState = {
        "origin": "Millennium Park, Chicago",
        "destination": "Union Station, Chicago",
        "query": "I want a calm walk with a good cafe on the way",
        "routes": candidates,
        "preferences": None,
        "route_scores": None,
        "chosen_route_id": None,
        "explanation": None,
    }

    # 4️⃣ run graph
    graph = build_graph()
    output = graph.invoke(state)

    print("\n===== AGENT OUTPUT =====\n")
    print("Preferences:")
    print(output["preferences"])

    print("\nRoute Scores:")
    print(output["route_scores"])

    print("\nChosen Route ID:", output["chosen_route_id"])

    print("\nExplanation:")
    print(output["explanation"])
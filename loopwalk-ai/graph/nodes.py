import json
from langchain_core.messages import HumanMessage
from loopwalk_ai.config import llm
from graph.state import AgentState


# ── Node 1 — Intent Parser ──────────────────────────────────────────
def parse_intent(state: AgentState) -> dict:
    """
    Input:  user_text, selected_goal
    Output: intent  (priority weight dict)
    """
    prompt = f"""You are part of a walking-route recommendation system.

The user said: "{state["user_text"]}"
Their selected goal is: "{state["selected_goal"]}"

Based on this, produce a JSON object with exactly three numeric weights
that sum to 1.0, representing how much the user cares about each factor:

  cafes_weight   – nearby cafes / points of interest
  crowd_weight   – avoiding crowded sidewalks
  distance_weight – shorter walking distance

Return ONLY the JSON object, no extra text.
Example: {{"cafes_weight": 0.4, "crowd_weight": 0.5, "distance_weight": 0.1}}"""

    response = llm.invoke([HumanMessage(content=prompt)])
    intent = json.loads(response.content.strip())
    return {"intent": intent}


# ── Node 2 — Route Selector ─────────────────────────────────────────
def select_route(state: AgentState) -> dict:
    """
    Input:  intent weights, route_summaries
    Output: chosen_route_id, chosen_route, rejected_routes
    No geometry — pure scoring.
    """
    weights = state["intent"]
    routes = state["route_summaries"]

    crowd_map = {"low": 1.0, "medium": 0.5, "high": 0.0}

    scored = []
    for r in routes:
        score = (
            weights.get("cafes_weight", 0) * (r["cafe_count"] / 10)
            + weights.get("crowd_weight", 0) * crowd_map.get(r["crowd_level"], 0.5)
            + weights.get("distance_weight", 0) * (1 - r["distance_km"] / 5)
        )
        scored.append((score, r))

    scored.sort(key=lambda x: x[0], reverse=True)

    best = scored[0][1]
    rejected = [r for _, r in scored[1:]]

    return {
        "chosen_route_id": best["route_id"],
        "chosen_route": best,
        "rejected_routes": rejected,
    }


# ── Node 3 — Explanation Generator ──────────────────────────────────
def generate_explanation(state: AgentState) -> dict:
    """
    Input:  chosen_route, rejected_routes, selected_goal
    Output: explanation text
    """
    chosen = json.dumps(state["chosen_route"], indent=2)
    rejected = json.dumps(state["rejected_routes"], indent=2)

    prompt = f"""You are a friendly walking-route assistant in Chicago's Loop.

The user's goal: "{state["selected_goal"]}"

You chose this route:
{chosen}

Other routes considered but not chosen:
{rejected}

Write a short, conversational explanation (2-3 sentences) of why you picked
this route over the others, referring to the user's goal. Do not mention
numeric scores or weights."""

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"explanation": response.content.strip()}

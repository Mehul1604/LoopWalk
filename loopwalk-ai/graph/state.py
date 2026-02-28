from typing import TypedDict, Optional


class RouteOption(TypedDict):
    route_id: str
    name: str
    distance_km: float
    crowd_level: str        # "low", "medium", "high"
    cafe_count: int
    safety_score: float     # 0-1


class AgentState(TypedDict):
    # --- inputs ---
    user_text: str
    selected_goal: str
    route_summaries: list[RouteOption]

    # --- after Node 1: Intent Parser ---
    intent: dict            # e.g. {"cafes_weight": 0.4, "crowd_weight": 0.5, "distance_weight": 0.1}

    # --- after Node 2: Route Selector ---
    chosen_route_id: str
    chosen_route: RouteOption
    rejected_routes: list[RouteOption]

    # --- after Node 3: Explanation Generator ---
    explanation: str

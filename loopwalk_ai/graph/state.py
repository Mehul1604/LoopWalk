from typing import TypedDict, List, Dict, Optional, Any
from loopwalk_ai.graph.schemas import RouteCandidate


class AgentState(TypedDict):
    origin: str
    destination: str
    query: str

    routes: List[RouteCandidate]

    preferences: Optional[Dict[str, float]]
    route_scores: Optional[List[Dict]]
    chosen_route_id: Optional[int]
    explanation: Optional[str]
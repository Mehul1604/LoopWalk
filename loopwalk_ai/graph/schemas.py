from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from typing import TypedDict


class RouteCandidate(TypedDict):
    route_id: int
    summary: str
    start_address: str
    end_address: str

    distance_m: int
    duration_s: int

    pois: Dict[str, List[Dict[str, Any]]]   # raw POI dicts per query

    crowd_avg: float
    crowd_max: float
    safety_avg: float
    safety_max: float  # 0-1

class IntentOutput(BaseModel):
    cafes: Optional[float] = Field(default=None, ge=0, le=1)
    parks: Optional[float] = Field(default=None, ge=0, le=1)
    safety: Optional[float] = Field(default=None, ge=0, le=1)
    low_crowd: Optional[float] = Field(default=None, ge=0, le=1)
    short_distance: Optional[float] = Field(default=None, ge=0, le=1)


class RouteScore(BaseModel):
    route_id: int
    score: float = Field(..., ge=0, le=1)


class RouteScoringOutput(BaseModel):
    scores: List[RouteScore]
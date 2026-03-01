from pydantic import BaseModel, Field
from typing import List, Dict, Any


class RouteRequest(BaseModel):
    origin: str = Field(..., example="Millennium Park, Chicago")
    destination: str = Field(..., example="Union Station, Chicago")
    user_query: str = Field(..., example="I want a calm walk with a good cafe")
    enrichment_queries: List[str] = Field(
        default_factory=lambda: ["cafe"],
        example=["cafe", "park"]
    )


class RouteResponse(BaseModel):
    route_id: int
    summary: str
    explanation: str

    # optional raw route object to render map on frontend
    route_data: Dict[str, Any]
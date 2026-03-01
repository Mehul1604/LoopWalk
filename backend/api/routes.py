from fastapi import APIRouter, HTTPException

from backend.api.schemas import RouteRequest, RouteResponse
from backend.services.agent_service import get_best_route

router = APIRouter()


@router.post("/route", response_model=RouteResponse)
def get_route(req: RouteRequest):
    try:
        result = get_best_route(
            origin=req.origin,
            destination=req.destination,
            user_query=req.user_query,
            enrichment_queries=req.enrichment_queries,
        )

        print("RAW AGENT RESULT:")
        print(result)

        return RouteResponse(
            route_id=result["route_id"],
            summary=result["summary"],
            explanation=result["explanation"],
            route_data=result["route"],   # full route object
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health():
    return {"status": "ok"}
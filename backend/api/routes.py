from fastapi import APIRouter, HTTPException

from backend.api.schemas import RouteRequest, RouteResponse, DurationRouteRequest
from backend.services.agent_service import get_best_route, get_best_route_by_duration

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

@router.post("/route/by-duration", response_model=RouteResponse)
def get_route_by_duration(req: DurationRouteRequest):
    try:
        result = get_best_route_by_duration(
            origin=req.origin,
            minutes=req.minutes,
            user_query=req.user_query,
            enrichment_queries=req.enrichment_queries,
        )

        print("RAW DURATION AGENT RESULT:")
        print(result)

        return RouteResponse(
            route_id=result["route_id"],
            summary=result["summary"],
            explanation=result["explanation"],
            route_data=result["route"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health():
    return {"status": "ok"}
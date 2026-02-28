import requests
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"


def get_walking_routes(origin: str, destination: str):
    """
    Fetch multiple walking routes between origin and destination.
    Returns raw Google routes list.
    """
    params = {
        "origin": origin,
        "destination": destination,
        "mode": "walking",
        "alternatives": "true",
        "key": GOOGLE_API_KEY,
    }

    response = requests.get(DIRECTIONS_URL, params=params)
    data = response.json()

    if data.get("status") != "OK":
        raise Exception(f"Directions API error: {data.get('status')}")

    return data["routes"]
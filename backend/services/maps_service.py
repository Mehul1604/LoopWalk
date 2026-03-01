import requests
import os
from dotenv import load_dotenv
import polyline
from backend.services.crowd_service import get_crowd_density
from backend.services.safety_service import get_crime_risk

import math

def haversine_m(lat1, lon1, lat2, lon2):
    """Distance in meters between two lat/lng points."""
    R = 6371000  # Earth radius in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi/2)**2
        + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    )

    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"


# -------------------------
# GEOCODING
# -------------------------



def decode_route_polyline(route):
    encoded = route["overview_polyline"]["points"]
    return polyline.decode(encoded)  # returns [(lat,lng), ...]

def sample_route_points(coords, step=15):
    """
    Take every Nth point along the route.
    """
    return coords[::step]

def search_places(lat, lng, query, radius=75):
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "keyword": query,
        "key": GOOGLE_API_KEY,
    }

    res = requests.get(PLACES_URL, params=params)
    data = res.json()

    valid_places = []

    for p in data.get("results", []):
        plat = p["geometry"]["location"]["lat"]
        plng = p["geometry"]["location"]["lng"]

        dist = haversine_m(lat, lng, plat, plng)

        # Only keep if truly within radius
        if dist <= radius:
            p["distance_m"] = round(dist, 1)
            valid_places.append(p)

    return valid_places

def deduplicate_routes(routes):
    seen = set()
    unique = []

    for r in routes:
        poly = r["polyline"]
        if poly not in seen:
            seen.add(poly)
            unique.append(r)

    return unique


def geocode_address(address: str):
    params = {
        "address": address,
        "key": GOOGLE_API_KEY,
    }

    res = requests.get(GEOCODE_URL, params=params)
    data = res.json()

    if data.get("status") != "OK":
        raise Exception(f"Geocoding failed: {data.get('status')}")

    loc = data["results"][0]["geometry"]["location"]

    return {
        "lat": loc["lat"],
        "lng": loc["lng"],
    }


# -------------------------
# SINGLE ROUTE REQUEST
# -------------------------
def fetch_routes(origin_latlng, dest_latlng, waypoint=None):
    params = {
        "origin": f"{origin_latlng['lat']},{origin_latlng['lng']}",
        "destination": f"{dest_latlng['lat']},{dest_latlng['lng']}",
        "mode": "walking",
        "alternatives": "true",
        "key": GOOGLE_API_KEY,
    }

    if waypoint:
        params["waypoints"] = f"{waypoint['lat']},{waypoint['lng']}"

    res = requests.get(DIRECTIONS_URL, params=params)
    data = res.json()

    if data.get("status") != "OK":
        return []

    return data["routes"]


# -------------------------
# GENERATE MANY ROUTES
# -------------------------
def get_many_routes(origin: str, destination: str, num_variations=6):
    """
    Generates multiple candidate routes by shifting waypoints.
    """

    origin_loc = geocode_address(origin)
    dest_loc = geocode_address(destination)

    # Compute midpoint
    mid_lat = (origin_loc["lat"] + dest_loc["lat"]) / 2
    mid_lng = (origin_loc["lng"] + dest_loc["lng"]) / 2

    # Offsets to force route diversity
    offsets = [
    (0.006, 0),
    (-0.006, 0),
    (0, 0.006),
    (0, -0.006),
    (0.008, 0.004),
    (-0.008, -0.004),
    (0.01, -0.003),
    (-0.01, 0.003),
]

    all_routes = []

    # 1️⃣ Direct call (baseline routes)
    all_routes.extend(fetch_routes(origin_loc, dest_loc))

    # all_routes[:] = deduplicate_routes(all_routes)

    # 2️⃣ Calls with shifted waypoints
    for dlat, dlng in offsets[:num_variations]:
        waypoint = {
            "lat": mid_lat + dlat,
            "lng": mid_lng + dlng,
        }
        all_routes.extend(fetch_routes(origin_loc, dest_loc, waypoint))

    # 3️⃣ Simplify results
    summaries = []

    return all_routes

def pick_best_places(places, top_n=5):
    """
    Rank places by distance and return top N.
    """

    def score(p):
        dist = p.get("distance_m", 9999)
        return -dist  # Lower distance = higher score

    ranked = sorted(places, key=score, reverse=True)
    return ranked[:top_n]

def summarize_place(place):
    loc = place["geometry"]["location"]

    return {
        "place_id": place.get("place_id"),
        "name": place.get("name"),
        "lat": loc.get("lat"),
        "lng": loc.get("lng"),
        "distance_m": place.get("distance_m"),
        "rating": place.get("rating"),
        "types": place.get("types", []),
        "address": place.get("vicinity"),
    }

def enrich_route(route, queries):
    coords = decode_route_polyline(route)
    sampled_points = sample_route_points(coords, step=20)

    enrichment = {q: [] for q in queries}
    seen = set()

    for lat, lng in sampled_points:
        for q in queries:
            places = search_places(lat, lng, q, radius=50)

            for p in places:
                if p['place_id'] not in seen:
                    seen.add(p['place_id'])
                    enrichment[q].append(summarize_place(p))

    # reorder places
    for q in queries:
        enrichment[q] = pick_best_places(enrichment[q], top_n=5)
    
    route["enrichment"] = enrichment

    return route

def enrich_with_crowd(route):
    coords = decode_route_polyline(route)
    sampled = sample_route_points(coords, step=20)

    densities = []

    for lat, lng in sampled:
        densities.append(get_crowd_density(lat, lng))

    if densities:
        route["crowd"] = {
            "avg_density": round(sum(densities) / len(densities), 2),
            "max_density": max(densities),
        }
    else:
        route["crowd"] = {"avg_density": 0, "max_density": 0}

    return route

def enrich_with_safety(route):
    coords = decode_route_polyline(route)
    sampled = sample_route_points(coords, step=20)

    risks = []

    for lat, lng in sampled:
        risks.append(get_crime_risk(lat, lng))

    if risks:
        route["safety"] = {
            "avg_risk": round(sum(risks) / len(risks), 2),
            "max_risk": max(risks),
        }
    else:
        route["safety"] = {"avg_risk": 0, "max_risk": 0}

    return route




# -------------------------
# TEST
# -------------------------
if __name__ == "__main__":
    routes = get_many_routes(
        "Millennium Park, Chicago",
        "Union Station, Chicago",
        num_variations=6
    )
    # routes_unique = deduplicate_routes(routes)
    print(f"\nGenerated {len(routes)} candidate routes\n")


    # for i, r in enumerate(routes, 1):
    #     print(f"Route {i}: {r}")
    
    for r in routes:
        enriched = enrich_route(r, queries=["cafe"])
        enriched = enrich_with_crowd(enriched)
        enriched = enrich_with_safety(enriched)
        print("\n\n=================================\n\n")
        print(f"ENRICHMENT for route: {enriched['summary']}")
        for k, v in enriched["enrichment"].items():
            print("for query", k)
            print("------")
            for place in v:
                print("<><><>")
                print(place)
        print("Crowd info:", enriched.get("crowd"))
        print("Safety info:", enriched.get("safety"))
        
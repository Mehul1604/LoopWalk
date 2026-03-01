import random
import math


def get_crime_risk(lat: float, lng: float) -> float:
    """
    Mock crime risk score (0–1).
    Higher = less safe.
    """

    # pretend some areas are riskier
    hot_spot_lat = 41.879
    hot_spot_lng = -87.630

    dist = math.sqrt((lat - hot_spot_lat) ** 2 + (lng - hot_spot_lng) ** 2)

    # closer to hotspot → higher risk
    base_risk = max(0.05, 0.9 - dist * 120)

    noise = random.uniform(-0.1, 0.1)

    return round(min(1.0, max(0.05, base_risk + noise)), 2)
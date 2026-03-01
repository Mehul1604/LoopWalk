import random
import math


def get_crowd_density(lat: float, lng: float) -> float:
    """
    Mock crowd density in people per square meter.
    Values roughly between 0.1 and 2.5
    """

    # Chicago downtown center approx
    center_lat = 41.8818
    center_lng = -87.6231

    # distance from downtown center
    dist = math.sqrt((lat - center_lat) ** 2 + (lng - center_lng) ** 2)

    # closer to center → more dense
    base_density = max(0.2, 2.2 - dist * 150)

    # add noise so routes differ slightly
    noise = random.uniform(-0.2, 0.2)

    return round(max(0.1, base_density + noise), 2)
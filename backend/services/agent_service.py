from loopwalk_ai.runner import run_agent


def get_best_route(
    origin: str,
    destination: str,
    user_query: str,
    enrichment_queries: list[str],
):
    """
    Backend wrapper around agent pipeline.
    """

    agent_state, enriched_routes = run_agent(
        origin,
        destination,
        user_query,
        enrichment_queries,
    )

    print("FINAL AGENT STATE:")
    print(agent_state)

    chosen_id = agent_state["chosen_route_id"]

    return {
        "route_id": chosen_id,
        "summary": enriched_routes[chosen_id]["summary"],
        "route": enriched_routes[chosen_id],
        "explanation": agent_state["explanation"],

        # optional debug info (can remove later)
        # "preferences": agent_state["preferences"],
        # "scores": agent_state["route_scores"],
        # "distance_m": leg["distance"]["value"],
        # "duration_s": leg["duration"]["value"],
    }

if __name__ == "__main__":
    result = get_best_route(
        origin="Millennium Park, Chicago",
        destination="Union Station, Chicago",
        user_query="I want a calm scenic walk with a good cafe",
        enrichment_queries=["cafe", "park"],
    )

    print("\n===============================")
    print("BEST ROUTE SUMMARY:")
    print(result["route"]["summary"])

    leg = result["route"]["legs"][0]
    print("Distance:", leg["distance"]["text"])
    print("Duration:", leg["duration"]["text"])

    print("\nEXPLANATION:")
    print(result["explanation"])

    print("\nPREFERENCES:")
    print(result["preferences"])

    print("\nSCORES:")
    print(result["scores"])
    print("===============================\n")
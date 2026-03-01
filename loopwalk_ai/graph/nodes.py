from loopwalk_ai.config import llm
from loopwalk_ai.graph.schemas import IntentOutput, RouteScoringOutput
from loopwalk_ai.prompts import INTENT_PROMPT, SCORING_PROMPT, EXPLANATION_PROMPT
from loopwalk_ai.graph.state import AgentState


def intent_node(state: AgentState):
    query = state["query"]

    structured_llm = llm.with_structured_output(IntentOutput)

    result = structured_llm.invoke(
        INTENT_PROMPT.format(query=query)
    )

    # Convert pydantic model → dict
    state["preferences"] = result.model_dump(exclude_none=True)

    return state

def scoring_node(state):
    structured_llm = llm.with_structured_output(RouteScoringOutput)

    result = structured_llm.invoke(
        SCORING_PROMPT.format(
            query=state["query"],
            preferences=state["preferences"],
            routes=state["routes"]
        )
    )

    state["route_scores"] = [r.model_dump() for r in result.scores]

    return state

def select_best_route_node(state: AgentState):
    scores = state["route_scores"]

    if not scores:
        raise ValueError("No route scores found")

    best = max(scores, key=lambda x: x["score"])
    state["chosen_route_id"] = best["route_id"]

    return state

def explanation_node(state: AgentState):
    chosen_id = state["chosen_route_id"]
    query = state["query"]

    # find chosen route
    chosen = None
    for r in state["routes"]:
        if r["route_id"] == chosen_id:
            chosen = r
            break

    if chosen is None:
        raise ValueError("Chosen route not found in candidates")

    prompt = EXPLANATION_PROMPT.format(
        query=query,
        summary=chosen["summary"],
        distance_m=chosen["distance_m"],
        duration_s=chosen["duration_s"],
        pois=chosen.get("pois", {})
    )

    response = llm.invoke(prompt)

    state["explanation"] = response.content.strip()

    return state
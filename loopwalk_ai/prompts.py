INTENT_PROMPT = """
You are an assistant that interprets a user's walking preferences.

Your task:
Convert the user's request into preference weights between 0 and 1.

Available preferences:
- cafes (desire to pass cafes or places to stop)
- parks (desire for scenic or green areas)
- safety (preference for safer routes)
- low_crowd (preference for quieter streets)
- short_distance (preference for shortest walk)

Rules:
- Only include preferences relevant to the user's request.
- At least ONE preference must be assigned.
- Values should reflect importance (0.1 weak → 1.0 strong).
- Return ONLY structured output.

User request:
{query}
"""

SCORING_PROMPT = """
You are evaluating walking routes for a user.

User request:
{query}

Interpreted preferences:
{preferences}

Routes:
{routes}

Assign a score between 0 and 1 to each route.

Higher score = better match to the user’s goals.

Consider:
- presence and quality of POIs
- safety levels
- crowd density
- walking distance
- overall experience

Return structured scores for each route.
"""

EXPLANATION_PROMPT = """
You are an urban walking assistant.

The user asked:
"{query}"

You selected the following walking route:

Route name: {summary}
Distance: {distance_m} meters
Duration: {duration_s} seconds
Points of interest along the route: {pois}

Explain briefly (2–3 sentences max) why this route is the best choice.
Mention the street name or summary and connect the explanation to the user's goal.
Be natural and helpful.
"""
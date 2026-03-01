# 🌆 LoopWalk AI

**Goal-Based Walking Intelligence for Urban Environments**

LoopWalk AI is an AI-assisted walking route system that helps users navigate cities based on their intentions — not just distance.
Instead of always choosing the fastest path, LoopWalk evaluates routes based on comfort, safety, discovery, and user goals.

The system combines real-world map data, contextual city signals, and an agentic AI decision layer to produce routes that feel better to walk.

---

## 🚶 The Problem

Urban walking involves more than getting from point A to point B.

People care about:

* Avoiding crowded streets
* Feeling safe at night
* Finding cafés or parks along the way
* Enjoying a calm or scenic walk
* Making use of limited time when exploring a city

Traditional navigation systems optimize primarily for speed and ignore these human preferences.

LoopWalk AI introduces a goal-aware walking system.

---

## 💡 What LoopWalk Does

LoopWalk AI turns a simple request like:

> “I want a calm walk with a café stop”

into a contextual routing decision.

The system:

1. Generates multiple candidate walking routes
2. Enriches each route with real-world signals
3. Uses an AI agent to interpret user goals
4. Scores routes against those goals
5. Selects the best route
6. Explains why it was chosen

The result is a navigation experience optimized for how users want to feel while walking.

---

## 🧠 Supported Routing Modes

LoopWalk currently supports **two types of route generation**:

### 1️⃣ Destination-Based Routing

Given an origin and destination:

* The system queries Google Maps for walking routes
* It computes a midpoint between origin and destination
* Multiple artificial waypoints are created around this midpoint
* Each waypoint is shifted slightly (roughly **500 m to 2 km**) to force different paths
* The routing API is called with each waypoint to generate diverse alternatives

This produces several viable routes between two locations that may pass through different streets, amenities, or neighborhoods rather than small variations of the same path.

---

### 2️⃣ Duration-Based Walking Loops

Given an origin and available time:

* Walking radius is estimated using average walking speed
* Boundary points are generated in a circle around the origin
* Each boundary point is slightly perturbed to avoid symmetric routes
* Routes are generated from origin to these boundary points
* This creates candidate walks that fit within the time budget while exploring different directions

This allows users to say:

> “I have 20 minutes — give me a good walk.”

---

## 🗺 Route Enrichment Signals

Each route is enriched with contextual data:

### Points of Interest

Nearby places along the route such as:

* cafés
* parks
* other discovery spots

### Crowd Density (Mocked)

Simulated pedestrian density sampled along the route.

### Safety Risk (Mocked)

Simulated safety indicators sampled along the route.

These signals are attached to each candidate route before AI evaluation.

---

## 🤖 How the AI Agent Works

The agent operates as a multi-step decision graph built using LangGraph.

### Step 1 — Intent Extraction

The AI reads the user’s natural language query and outputs structured preferences such as:

* preference for cafés
* desire for low crowd
* emphasis on safety
* preference for short distance

Each preference receives a weight between 0 and 1.

---

### Step 2 — Route Scoring

The AI examines every candidate route and evaluates how well it matches the preferences.

It considers:

* available POIs along the path
* route length and duration
* crowd density signals
* safety signals

Each route receives a score between 0 and 1.

---

### Step 3 — Route Selection

The highest-scoring route is selected.

---

### Step 4 — Explanation Generation

The AI produces a short explanation describing why this route best matches the user’s goals.

This makes the system interpretable and demo-friendly.

---

## ⚙️ System Architecture

The project is organized into two major layers.

### Backend (FastAPI)

Handles:

* route generation via Google Maps APIs
* route enrichment with POIs and signals
* orchestration of the AI agent
* API endpoints for frontend integration

### Agent Layer (LangGraph)

Handles:

* interpreting user intent
* reasoning over route candidates
* selecting the best route
* generating explanations

---

## 📂 Current Repository Structure

```text
LoopWalk/
│
├── backend/
│   ├── main.py                # FastAPI app entry
│   │
│   ├── api/
│   │   ├── routes.py          # REST endpoints
│   │   └── schemas.py         # request/response models
│   │
│   └── services/
│       ├── maps_service.py    # Google Maps routing + enrichment
│       ├── crowd_service.py   # mock crowd density signals
│       ├── safety_service.py  # mock safety signals
│       └── agent_service.py   # wrapper around AI runner
│
├── loopwalk_ai/
│   ├── config.py              # LLM setup
│   ├── prompts.py             # prompt templates
│   │
│   ├── graph/
│   │   ├── state.py           # shared agent state schema
│   │   ├── schemas.py         # structured LLM outputs
│   │   └── nodes.py           # intent, scoring, selection, explanation
│   │
│   └── runner.py              # full agent pipeline orchestration
│
├── requirements.txt
├── .env
└── README.md
```

## ▶️ How to Run

### 1️⃣ Clone the repository

    git clone <your-repo-url>
    cd LoopWalk

---

### 2️⃣ Create and activate a virtual environment

    python -m venv venv
    source venv/bin/activate      # Mac/Linux
    venv\Scripts\activate         # Windows

---

### 3️⃣ Install dependencies

All Python dependencies for the backend and agent live in:

    loopwalk_ai/requirements.txt

Install them with:

    pip install -r loopwalk_ai/requirements.txt

---

### 4️⃣ Create a `.env` file in the project root

Add the following keys:

    OPENAI_API_KEY=your_openai_key_here
    GOOGLE_MAPS_API_KEY=your_google_maps_key_here

These are required for:

• LLM reasoning (OpenAI)  
• Route + Places data (Google Maps APIs)

---

### 5️⃣ Start the FastAPI backend

Run from the project root:

    uvicorn backend.main:app --reload

You should see:

    Uvicorn running on http://127.0.0.1:8000

---

### 6️⃣ Test the API

Open:

    http://127.0.0.1:8000/docs

This launches the interactive Swagger UI where you can test:

• `/route` — destination-based routing  
• `/route-duration` — time-based walking loops  

---

### ✅ You're ready to go!

The backend will now:

1. Generate multiple candidate routes  
2. Enrich them with POIs, crowd, and safety signals  
3. Use the agent to select the best one  
4. Return the chosen route with an explanation

---

## 🚀 API Endpoints

### Generate route between two places

```
POST /route
```

### Generate best walk within a time budget

```
POST /route/by-duration
```

### Health check

```
GET /health
```

---

## 🏙 Vision

LoopWalk AI treats city navigation as an experience design problem rather than a shortest-path problem.

The project demonstrates how:

* agent-driven reasoning
* contextual urban signals
* explainable AI decisions

can combine to create more human-centered navigation tools.

---

## ⚡ Status

LoopWalk AI is a rapid prototype designed for demonstration and experimentation.
It focuses on clarity, reasoning transparency, and user experience rather than production accuracy.

---

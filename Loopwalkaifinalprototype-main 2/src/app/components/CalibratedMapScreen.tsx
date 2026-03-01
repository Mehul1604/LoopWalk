import image_8774b0bd1df166ad114767342f591fd7cb12d3c3 from 'figma:asset/8774b0bd1df166ad114767342f591fd7cb12d3c3.png'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, Clock, Footprints, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { ChatBox } from "./ChatBox";

interface RouteStep {
  name: string;
  description: string;
  distance: string;
  type: "start" | "waypoint" | "destination";
}

const ROUTE_STEPS: RouteStep[] = [
  { name: "Current Location", description: "Starting point", distance: "0 mi", type: "start" },
  { name: "State Street", description: "Head north on State St", distance: "0.2 mi", type: "waypoint" },
  { name: "Madison Street", description: "Turn right onto Madison", distance: "0.1 mi", type: "waypoint" },
  { name: "Wabash Avenue", description: "Continue east", distance: "0.2 mi", type: "waypoint" },
  { name: "First Landmark", description: "Point of interest", distance: "0.1 mi", type: "waypoint" },
  { name: "Michigan Avenue", description: "Turn north", distance: "0.3 mi", type: "waypoint" },
  { name: "Second Landmark", description: "Historical site", distance: "0.2 mi", type: "waypoint" },
  { name: "Randolph Street", description: "Turn west", distance: "0.2 mi", type: "waypoint" },
  { name: "Third Landmark", description: "Featured location", distance: "0.3 mi", type: "waypoint" },
  { name: "Final Approach", description: "Approaching destination", distance: "0.2 mi", type: "waypoint" },
];

export function CalibratedMapScreen() {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(0);
  const [mode, setMode] = useState<"destination" | "duration">("destination");
  const [goal, setGoal] = useState("");
  const [goalDetail, setGoalDetail] = useState("");
  const [isCalibrating, setIsCalibrating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionMode = sessionStorage.getItem("mode");
    const selectedGoal = sessionStorage.getItem("goal");

    if (!sessionMode || !selectedGoal) {
      navigate("/start");
      return;
    }

    setMode(sessionMode as "destination" | "duration");
    setGoal(selectedGoal);
    if (sessionMode === "destination") {
      const dest = sessionStorage.getItem("destination");
      if (dest) setDestination(dest);
    } else if (sessionMode === "duration") {
      const dur = sessionStorage.getItem("duration");
      if (dur) setDuration(parseInt(dur));
    }
    const detail = sessionStorage.getItem("goalDetail");
    if (detail) setGoalDetail(detail);

    // Simulate calibration
    setTimeout(() => {
      setIsCalibrating(false);
    }, 2000);
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartWalk = () => {
    // Navigate to active navigation screen
    navigate("/navigate");
  };

  const totalDistance = ROUTE_STEPS.reduce((acc, step) => {
    const dist = parseFloat(step.distance);
    return acc + (isNaN(dist) ? 0 : dist);
  }, 0).toFixed(1);

  const waypointCount = ROUTE_STEPS.filter((s) => s.type === "waypoint").length;

  if (isCalibrating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 max-w-[430px] mx-auto">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Navigation className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl mb-3">Calibrating Route</h2>
          <p className="text-muted-foreground">
            Finding the best path for your journey...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center mb-6 hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl mb-3">Your Route</h1>
        <p className="text-muted-foreground">
          {goalDetail ? `${goalDetail} - ` : ""}
          {goal.charAt(0).toUpperCase() + goal.slice(1)} walk through Chicago Loop
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col overflow-y-auto">
        {/* Map Preview */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-6 relative overflow-hidden min-h-[320px]">
          {/* Enhanced map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 grid-rows-12 h-full">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border border-primary/20"></div>
                ))}
              </div>
            </div>

            {/* Map overlay image */}
            <img 
              src={image_8774b0bd1df166ad114767342f591fd7cb12d3c3}
              alt="Map overlay"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Location markers */}
            <div className="absolute top-[12%] right-[10%] w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <div className="absolute top-[35%] left-[25%] w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse" style={{ animationDelay: "0.5s" }}>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <div className="absolute bottom-[25%] right-[30%] w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse" style={{ animationDelay: "1s" }}>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>

            {/* Start marker */}
            <div className="absolute bottom-[12%] left-[10%] w-10 h-10 rounded-full bg-accent border-3 border-primary flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            </div>

            {/* Destination marker */}
            <div className="absolute top-[12%] right-[10%] w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>

          {/* Map overlay info */}
          <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Total Distance</span>
              </div>
              <span className="font-medium">{totalDistance} mi</span>
            </div>
          </div>
        </div>

        {/* Route Steps */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h3 className="mb-4">Route Details</h3>
          <div className="relative space-y-4 max-h-[280px] overflow-y-auto pr-2">
            {ROUTE_STEPS.map((step, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                {/* Marker */}
                <div className="flex-shrink-0 relative z-10">
                  {step.type === "start" ? (
                    <div className="w-5 h-5 rounded-full bg-accent border-3 border-primary"></div>
                  ) : step.type === "destination" ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-primary mt-0.5"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <p className={`${step.type === "start" || step.type === "destination" ? "font-medium" : ""} mb-1`}>
                    {step.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Distance */}
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  {step.distance}
                </div>
              </div>
            ))}

            {/* Destination */}
            {mode === "destination" && destination && (
              <div className="flex items-start gap-4 relative">
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <p className="font-medium mb-1">{destination}</p>
                  <p className="text-sm text-muted-foreground">Final destination</p>
                </div>
              </div>
            )}

            {/* Connecting line */}
            <div className="absolute left-[10px] top-2 bottom-6 w-0.5 bg-gradient-to-b from-accent via-primary to-primary rounded-full -z-0"></div>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h3 className="mb-4">Trip Summary</h3>
          <div className="space-y-4">
            {mode === "destination" && destination && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="truncate">{destination}</p>
                </div>
              </div>
            )}
            {mode === "duration" && duration > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p>{duration} minutes</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Footprints className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waypoints</p>
                <p>{waypointCount} stops along the route</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleStartWalk}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#E4002B] to-[#FF6D6D] hover:opacity-90 active:bg-[#E4002B] active:bg-none text-white"
          >
            <Navigation className="mr-2 w-5 h-5" />
            Start Walking
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Follow the route to discover Chicago Loop
          </p>
        </div>
      </div>

      {/* Chat Box */}
      <ChatBox />
    </div>
  );
}
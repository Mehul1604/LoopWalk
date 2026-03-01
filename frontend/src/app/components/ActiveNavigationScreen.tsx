import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Navigation, 
  MapPin, 
  X, 
  ChevronUp, 
  ChevronDown,
  Footprints,
  AlertCircle,
  RotateCcw,
  Home
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import buxtonRdImage from "figma:asset/c853ed582377d4d4af9b1da8d6e72d7a47b246a5.png";

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
  { name: "Final Destination", description: "You've arrived!", distance: "0.2 mi", type: "destination" },
];

export function ActiveNavigationScreen() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [isNavigating, setIsNavigating] = useState(true);

  useEffect(() => {
    // Simulate navigation progress
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ROUTE_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 8000); // Move to next step every 8 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const currentStep = ROUTE_STEPS[currentStepIndex];
  const nextStep = ROUTE_STEPS[currentStepIndex + 1];
  const remainingSteps = ROUTE_STEPS.slice(currentStepIndex + 1);
  const completedSteps = ROUTE_STEPS.slice(0, currentStepIndex);

  const totalDistance = ROUTE_STEPS.reduce((acc, step) => {
    const dist = parseFloat(step.distance);
    return acc + (isNaN(dist) ? 0 : dist);
  }, 0).toFixed(1);

  const remainingDistance = remainingSteps.reduce((acc, step) => {
    const dist = parseFloat(step.distance);
    return acc + (isNaN(dist) ? 0 : dist);
  }, 0).toFixed(1);

  const progress = (currentStepIndex / (ROUTE_STEPS.length - 1)) * 100;

  const handleEndNavigation = () => {
    navigate("/walk");
  };

  const handleStartNewRoute = () => {
    // Clear session storage and navigate to start
    sessionStorage.clear();
    navigate("/start");
  };

  const handleRecenter = () => {
    // Simulate recentering the map
    alert("Map recentered to your current location");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto relative">
      {/* Enhanced Map View */}
      <div className="relative h-[60vh] bg-gradient-to-br from-secondary via-background to-secondary/50 overflow-hidden">
        {/* Satellite Map Background */}
        <div className="absolute inset-0">
          <ImageWithFallback 
            src={buxtonRdImage}
            alt="Chicago Loop street view"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay to ensure route visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40"></div>
        </div>

        {/* Street grid overlay for enhanced detail */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Vertical streets */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 8.33}
                y1="0"
                x2={i * 8.33}
                y2="100"
                stroke="white"
                strokeWidth="0.3"
                opacity="0.6"
              />
            ))}
            {/* Horizontal streets */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 8.33}
                x2="100"
                y2={i * 8.33}
                stroke="white"
                strokeWidth="0.3"
                opacity="0.6"
              />
            ))}
          </svg>
        </div>

        {/* Animated route path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500">
          <defs>
            <linearGradient id="activeRouteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className="[stop-color:var(--accent)]" stopOpacity="0.8" />
              <stop offset={`${progress}%`} className="[stop-color:var(--primary)]" stopOpacity="0.9" />
              <stop offset={`${progress}%`} className="[stop-color:var(--secondary)]" stopOpacity="0.4" />
              <stop offset="100%" className="[stop-color:var(--secondary)]" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main route path */}
          <path
            d="M 200 450 L 200 400 L 180 350 L 200 300 L 220 250 L 200 200 L 180 150 L 200 100 L 200 50"
            stroke="url(#activeRouteGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Waypoint markers */}
          {ROUTE_STEPS.map((step, index) => {
            const y = 450 - (index * 45);
            const x = 200 + (index % 2 === 0 ? 0 : (index % 4 === 1 ? -20 : 20));
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 16 : 8}
                  className={isCompleted ? "fill-primary" : isCurrent ? "fill-accent" : "fill-secondary"}
                  opacity={isCompleted ? 1 : isCurrent ? 1 : 0.4}
                  stroke={isCurrent ? "var(--primary)" : "none"}
                  strokeWidth={isCurrent ? 3 : 0}
                />
                {isCurrent && (
                  <circle
                    cx={x}
                    cy={y}
                    r={16}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      from="16"
                      to="24"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Current location indicator (pulsing dot) */}
        <div 
          className="absolute w-6 h-6 rounded-full flex items-center justify-center transition-all duration-1000"
          style={{
            left: '50%',
            top: `${90 - (currentStepIndex * 9)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute w-6 h-6 rounded-full bg-accent animate-ping"></div>
          <div className="absolute w-4 h-4 rounded-full border-3 border-white bg-primary"></div>
        </div>

        {/* Top overlay - Exit button */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
          <button
            onClick={handleEndNavigation}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg bg-foreground/90 text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleRecenter}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg bg-foreground/90 text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="absolute top-20 left-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-foreground">Progress</span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 bg-primary"
                style={{ 
                  width: `${progress}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Instructions Panel */}
      <div className="flex-1 flex flex-col">
        {/* Current Instruction */}
        <div className="p-6 border-b border-border bg-primary">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/80 mb-1">{currentStep.distance} ahead</p>
              <h2 className="text-xl text-white mb-1">{currentStep.name}</h2>
              <p className="text-white/90">{currentStep.description}</p>
            </div>
          </div>
        </div>

        {/* Next Step Preview */}
        {nextStep && (
          <div className="px-6 py-4 bg-accent/20 border-b border-border">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Then:</span> {nextStep.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Route Details Toggle */}
        <button
          onClick={() => setShowRouteDetails(!showRouteDetails)}
          className="flex items-center justify-between px-6 py-4 bg-card border-b border-border hover:bg-accent/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Footprints className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-sm text-foreground">
                {remainingDistance} mi remaining • {remainingSteps.length} stops
              </p>
            </div>
          </div>
          {showRouteDetails ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Expandable Route Details */}
        {showRouteDetails && (
          <div className="px-6 py-4 bg-card border-b border-border max-h-48 overflow-y-auto">
            <h3 className="mb-3 text-foreground">Upcoming Steps</h3>
            <div className="space-y-3">
              {remainingSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white">{currentStepIndex + index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{step.name}</p>
                    <p className="text-muted-foreground text-xs">{step.description}</p>
                  </div>
                  <span className="text-muted-foreground text-xs">{step.distance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="mt-auto p-6 bg-card border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-1">Total Distance</p>
              <p className="text-lg text-primary">{totalDistance} mi</p>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-lg text-primary">{completedSteps.length}/{ROUTE_STEPS.length}</p>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-lg text-primary">{remainingDistance} mi</p>
            </div>
          </div>
          
          {/* New Route Button */}
          <button
            onClick={handleStartNewRoute}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 border-2 border-primary text-primary transition-all hover:bg-accent/10"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Start New Route</span>
          </button>
        </div>
      </div>
    </div>
  );
}
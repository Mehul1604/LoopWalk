import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import backgroundImage from "figma:asset/9b370f66781cdba43118b7ea76c7124ba907cf9f.png";
import logoImage from "figma:asset/35efb08e2b33d16febc694609375fbf65a4ca3da.png";

// Chicago Loop popular destinations
const POPULAR_DESTINATIONS = [
  "Millennium Park",
  "The Bean",
  "Art Institute",
  "Willis Tower",
  "Riverwalk",
  "Navy Pier",
];

export function StartScreen() {
  const [mode, setMode] = useState<"destination" | "duration">("destination");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(30);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (mode === "destination" && destination.trim()) {
      sessionStorage.setItem("mode", "destination");
      sessionStorage.setItem("destination", destination);
      sessionStorage.removeItem("duration");
    } else if (mode === "duration") {
      sessionStorage.setItem("mode", "duration");
      sessionStorage.setItem("duration", duration.toString());
      sessionStorage.removeItem("destination");
    } else {
      return;
    }
    navigate("/goals");
  };

  const handleQuickSelect = (place: string) => {
    setDestination(place);
  };

  const canContinue = mode === "destination" ? destination.trim() : true;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto">
      {/* Map Preview */}
      <div className="relative h-[280px] bg-card border-b border-border overflow-hidden">
        {/* Simplified map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-10 grid-rows-10 h-full">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border border-primary/20"></div>
              ))}
            </div>
          </div>

          {/* Route paths */}
          <img 
            src={backgroundImage} 
            alt="Chicago Loop"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />

          {/* Location markers */}
          
        </div>

        {/* Overlay title */}
        <div className="absolute top-0 left-0 pt-6 px-6">
          <img 
            src={logoImage} 
            alt="LoopWalk" 
            className="h-16 w-auto drop-shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-6 flex flex-col">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "destination" | "duration")} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-secondary rounded-xl p-1">
            <TabsTrigger value="destination" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <MapPin className="w-4 h-4 mr-2" />
              Destination
            </TabsTrigger>
            <TabsTrigger value="duration" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Clock className="w-4 h-4 mr-2" />
              Duration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="destination" className="mt-6 space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Enter destination..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                className="h-14 bg-card border-border rounded-xl px-5 placeholder:text-muted-foreground/60"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">Popular places</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_DESTINATIONS.map((place) => (
                  <button
                    key={place}
                    onClick={() => handleQuickSelect(place)}
                    className={`px-4 py-2.5 rounded-full border transition-all ${
                      destination === place
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="duration" className="mt-6 space-y-8">
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-2 text-primary">{duration}</div>
                <div className="text-muted-foreground">minutes</div>
              </div>

              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={10}
                max={120}
                step={5}
                className="w-full"
              />

              <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                <span>10 min</span>
                <span>120 min</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">Quick select</p>
              <div className="grid grid-cols-4 gap-3">
                {[15, 30, 45, 60].map((time) => (
                  <button
                    key={time}
                    onClick={() => setDuration(time)}
                    className={`py-3 rounded-xl border transition-all ${
                      duration === time
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    {time}m
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-auto">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
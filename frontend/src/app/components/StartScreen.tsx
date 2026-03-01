import image_d6934776d937b30755bde312d201730947b967dc from 'figma:assets/d6934776d937b30755bde312d201730947b967dc.png'
import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import backgroundImage from "figma:assets/9b370f66781cdba43118b7ea76c7124ba907cf9f.png";
import logoImage from "figma:assets/35efb08e2b33d16febc694609375fbf65a4ca3da.png";

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
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#86BBD8]/30 via-[#F2F9FC] to-[#86BBD8]/20">
            {/* Mock street grid */}
            <img 
              src={image_d6934776d937b30755bde312d201730947b967dc} 
              alt="Satellite view"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            
            {/* Mock landmarks */}
            <div className="absolute top-12 left-16 w-8 h-8 bg-[#233642]/20 rounded"></div>
            <div className="absolute top-32 right-20 w-6 h-10 bg-[#233642]/20 rounded"></div>
            <div className="absolute bottom-16 left-24 w-12 h-6 bg-[#9EE493]/30 rounded"></div>
            
            {/* Current location marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Pulsing circle */}
              <div className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-[#336699]/20 rounded-full animate-ping"></div>
              {/* Location dot */}
              <div className="relative w-5 h-5 bg-[#336699] border-[3px] border-white rounded-full shadow-lg"></div>
            </div>
            
            {/* Location label */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md text-xs">
              <span className="text-[#336699]">📍</span> Current Location
            </div>
          </div>

          {/* Location markers */}
          
        </div>

        {/* Overlay title */}
        <div className="absolute top-0 left-0 pt-6 px-6">
          
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
              {/* Current Location Display */}
              <div className="mb-4 p-4 bg-card border border-border rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-[#336699]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-[#336699] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Current Location</p>
                  <p className="text-sm font-medium truncate">Chicago Loop, IL</p>
                </div>
              </div>
              
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
            className="w-full h-14 rounded-xl bg-[#E4002B] bg-gradient-to-r from-[#E4002B] to-[#E4002B]/80 hover:opacity-90 active:bg-[#E4002B] active:bg-none text-white disabled:opacity-50"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronDown, ChevronUp, Landmark, Film, Zap, ArrowRight, MessageCircle, Send, UtensilsCrossed } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";

type GoalCategory = "historic" | "movie" | "energy" | "food" | "custom" | null;

interface HistoricPlace {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface MovieLocation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  movies: string;
}

interface EnergyOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface FoodOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const HISTORIC_PLACES: HistoricPlace[] = [
  {
    id: "rookery",
    name: "The Rookery Building",
    description: "Stunning blend of Chicago School and Frank Lloyd Wright redesign with iconic light court.",
    imageUrl: "https://images.unsplash.com/photo-1746045383707-46de5dd74d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb29rZXJ5JTIwQnVpbGRpbmclMjBDaGljYWdvJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyMzMwOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "marquette",
    name: "Marquette Building",
    description: "National Historic Landmark with gorgeous mosaics and turn-of-the-century flare.",
    imageUrl: "https://images.unsplash.com/photo-1731115996007-f065356c968d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYXJxdWV0dGUlMjBCdWlsZGluZyUyMENoaWNhZ28lMjBoaXN0b3JpY3xlbnwxfHx8fDE3NzIzMzA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "marshall-field",
    name: "Marshall Field and Company Building",
    description: "Historic retail palace on State Street (now Macy's location).",
    imageUrl: "https://images.unsplash.com/photo-1746023842352-537a283ac1d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwYXJjaGl0ZWN0dXJlJTIwc2t5c2NyYXBlciUyMGhpc3RvcmljfGVufDF8fHx8MTc3MjMzMDk1MXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "field",
    name: "Field Building",
    description: "Elegant early skyscraper neighbor to the Rookery.",
    imageUrl: "https://images.unsplash.com/photo-1746023842317-c08fad9723ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwUml2ZXJ3YWxrJTIwd2F0ZXJmcm9udHxlbnwxfHx8fDE3NzIzMjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "stock-exchange",
    name: "Chicago Stock Exchange Arch",
    description: "Surviving piece of Adler & Sullivan's famed building.",
    imageUrl: "https://images.unsplash.com/photo-1728509983124-ad68cefa079b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwU3RvY2slMjBFeGNoYW5nZSUyMEFyY2h8ZW58MXx8fHwxNzcyMzMwOTUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

const MOVIE_LOCATIONS: MovieLocation[] = [
  { 
    id: "lasalle", 
    name: "LaSalle Street", 
    description: "Featured in The Dark Knight during the dramatic chase scene. This iconic financial corridor showcases Chicago's stunning architecture.",
    imageUrl: "https://images.unsplash.com/photo-1650679092343-7baa9bd532dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYVNhbGxlJTIwU3RyZWV0JTIwQ2hpY2FnbyUyMGRvd250b3dufGVufDF8fHx8MTc3MjMyOTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    movies: "The Dark Knight (2008)"
  },
  { 
    id: "lower-wacker", 
    name: "Lower Wacker Drive", 
    description: "Iconic underground chase scene location from The Dark Knight and Transformers: Dark of the Moon. This multi-level street system is instantly recognizable.",
    imageUrl: "https://images.unsplash.com/photo-1651716811668-0302216cb506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMb3dlciUyMFdhY2tlciUyMERyaXZlJTIwQ2hpY2Fnb3xlbnwxfHx8fDE3NzIzMjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    movies: "The Dark Knight (2008), Transformers 3 (2011)"
  },
  { 
    id: "board-of-trade", 
    name: "Chicago Board of Trade Building", 
    description: "Featured in Ferris Bueller's Day Off and The Dark Knight. The Art Deco landmark with its distinctive statue is one of Chicago's most filmed buildings.",
    imageUrl: "https://images.unsplash.com/photo-1719856984995-ddaf42482916?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwQm9hcmQlMjBvZiUyMFRyYWRlJTIwQnVpbGRpbmd8ZW58MXx8fHwxNzcyMzI5ODU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    movies: "The Dark Knight (2008), Ferris Bueller (1986)"
  },
  { 
    id: "stranger-things", 
    name: "Chicago Streets & Alleys", 
    description: "Featured in Stranger Things Season 2 Episode 7 'The Lost Sister'. Eleven reunites with her sister Kali in urban Chicago, showcasing the city's grittier side.",
    imageUrl: "https://images.unsplash.com/photo-1682987211142-2ee02cba9269?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwYWxsZXklMjB1cmJhbiUyMGdyYWZmaXRpfGVufDF8fHx8MTc3MjMzMDk1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    movies: "Stranger Things S2E7 (2017)"
  },
  { 
    id: "riverwalk", 
    name: "Chicago Riverwalk", 
    description: "Seen in The Fugitive during Harrison Ford's famous jump scene. The scenic waterfront walkway has been featured in countless films and TV shows.",
    imageUrl: "https://images.unsplash.com/photo-1746023842317-c08fad9723ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwUml2ZXJ3YWxrJTIwd2F0ZXJmcm9udHxlbnwxfHx8fDE3NzIzMjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    movies: "The Fugitive (1993), Batman Begins (2005)"
  },
  { 
    id: "millennium", 
    name: "Millennium Park", 
    description: "Featured in Source Code and The Break-Up. The Cloud Gate sculpture (The Bean) and modern park are iconic filming locations for contemporary Chicago films.",
    imageUrl: "https://images.unsplash.com/photo-1667940110529-7a0386b6bf92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaWxsZW5uaXVtJTIwUGFyayUyMENoaWNhZ28lMjBCZWFufGVufDF8fHx8MTc3MjMyOTg1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    movies: "Source Code (2011), The Break-Up (2006)"
  },
];

const ENERGY_OPTIONS: EnergyOption[] = [
  { 
    id: "high", 
    name: "Energetic", 
    description: "Dynamic routes including hills and elevated paths. Perfect for an active, challenging walk.",
    imageUrl: "https://images.unsplash.com/photo-1662651800883-b784f138e9dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBydW5uaW5nJTIwZW5lcmdldGljJTIwZml0bmVzc3xlbnwxfHx8fDE3NzIzMzA5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: "medium", 
    name: "Moderate", 
    description: "Balanced and moderate walks. A comfortable pace for sightseeing and discovery.",
    imageUrl: "https://images.unsplash.com/photo-1539600533638-6800508f1ddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3YWxraW5nJTIwZW5lcmdldGljJTIwYWN0aXZlfGVufDF8fHx8MTc3MjMzA5NTMnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: "low", 
    name: "Relaxed", 
    description: "Relaxed and leisurely walks. Take your time to truly connect with your surroundings.",
    imageUrl: "https://images.unsplash.com/photo-1760542758210-7f1be42027dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBtZWRpdGF0aW5nJTIwcmVsYXhlZCUyMHNlcmVuZXxlbnwxfHx8fDE3NzIzMzA5NTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

const FOOD_OPTIONS: FoodOption[] = [
  { 
    id: "cozy-cafes", 
    name: "Cozy Cafes", 
    description: "Routes including charming cafes perfect for catching up with friends over coffee and conversation.",
    imageUrl: "https://images.unsplash.com/photo-1607702307367-0a49cc6ad6bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwY2FmZSUyMGZyaWVuZHMlMjBnYXRoZXJpbmd8ZW58MXx8fHwxNzcyMzQwNDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: "restaurants", 
    name: "Dining Destinations", 
    description: "Walk includes stops at popular Chicago restaurants where groups can enjoy meals together.",
    imageUrl: "https://images.unsplash.com/photo-1745924811119-cd78399a0ed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwcmVzdGF1cmFudCUyMGRvd250b3duJTIwZGluaW5nfGVufDF8fHx8MTc3MjM0MDQzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: "social-spots", 
    name: "Social Gathering Spots", 
    description: "Routes highlighting lively cafes and eateries where friends naturally gather and connect.",
    imageUrl: "https://images.unsplash.com/photo-1653762370785-24d6f8835044?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwcGVvcGxlJTIwc29jaWFsaXppbmd8ZW58MXx8fHwxNzcyMzQwNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: "chicago-classics", 
    name: "Chicago Food Classics", 
    description: "Experience iconic Chicago deep-dish pizza and other local favorites with your group.",
    imageUrl: "https://images.unsplash.com/photo-1734730594447-9ae47bcb255f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGljYWdvJTIwZGVlcCUyMGRpc2glMjBwaXp6YXxlbnwxfHx8fDE3NzIzNDA0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: "brunch-walks", 
    name: "Brunch & Walk", 
    description: "Routes featuring brunch spots perfect for leisurely group meals and social connections.",
    imageUrl: "https://images.unsplash.com/photo-1565979612809-d90c6ca38df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVuY2glMjByZXN0YXVyYW50JTIwZnJpZW5kc3xlbnwxfHx8fDE3NzIzNDA0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
];

export function GoalSelectionScreen() {
  const [expandedCategory, setExpandedCategory] = useState<GoalCategory>(null);
  const [selectedHistoric, setSelectedHistoric] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [mode, setMode] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = sessionStorage.getItem("mode");
    if (!savedMode) {
      navigate("/start");
    } else {
      setMode(savedMode);
      // Set initial AI message based on mode
      const initialMessage: ChatMessage = {
        id: "1",
        text: savedMode === "destination" 
          ? "Hi! Describe your ideal walk in Chicago Loop. I'll suggest specific locations you can add to create your perfect route!"
          : "Hi! You've selected a time-based walk. Tell me what interests you, and I'll suggest locations you can add to your walk to make the most of your time!",
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages([initialMessage]);
    }
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleCategory = (category: GoalCategory) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
      // Clear other selections when switching category
      if (category === "historic") {
        setSelectedMovie(null);
        setSelectedEnergy(null);
        setSelectedFood(null);
      } else if (category === "movie") {
        setSelectedHistoric(null);
        setSelectedEnergy(null);
        setSelectedFood(null);
      } else if (category === "energy") {
        setSelectedHistoric(null);
        setSelectedMovie(null);
        setSelectedFood(null);
      } else if (category === "food") {
        setSelectedHistoric(null);
        setSelectedMovie(null);
        setSelectedEnergy(null);
      }
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const isDestinationMode = mode === "destination";

    if (lowerMessage.includes("art") || lowerMessage.includes("museum") || lowerMessage.includes("gallery")) {
      if (isDestinationMode) {
        return "Perfect! For an art-focused walk, I suggest adding these locations: Art Institute of Chicago, Chicago Cultural Center, and Millennium Park (Cloud Gate). You can add these to create your custom route!";
      } else {
        return "Great! You can add these art locations to your walk: Art Institute of Chicago, Chicago Cultural Center, Millennium Park. I'll generate a route that fits your selected time!";
      }
    } else if (lowerMessage.includes("food") || lowerMessage.includes("restaurant") || lowerMessage.includes("cafe") || lowerMessage.includes("eat")) {
      if (isDestinationMode) {
        return "Delicious! I recommend adding: Portillo's (classic Chicago hot dogs), Lou Malnati's (deep dish pizza), and The Berghoff (historic German restaurant). Add these to build your foodie route!";
      } else {
        return "You can add these dining spots to your walk: Portillo's, Lou Malnati's, and The Berghoff. I'll map the best route for your time!";
      }
    } else if (lowerMessage.includes("quiet") || lowerMessage.includes("peaceful") || lowerMessage.includes("calm")) {
      if (isDestinationMode) {
        return "Perfect for mindfulness! I suggest adding these serene locations: Lurie Garden in Millennium Park, Chicago Cultural Center's Tiffany Dome, and the quiet courtyards of The Rookery Building.";
      } else {
        return "You can add these peaceful spots: Lurie Garden, Chicago Cultural Center, The Rookery courtyard. I'll create a calming route within your time!";
      }
    } else if (lowerMessage.includes("photo") || lowerMessage.includes("instagram") || lowerMessage.includes("picture")) {
      if (isDestinationMode) {
        return "Instagram-ready! I suggest adding: Cloud Gate (The Bean), Chicago Riverwalk, and the Board of Trade Building. These make for stunning photos!";
      } else {
        return "You can add these photogenic locations: Cloud Gate, Chicago Riverwalk, Board of Trade Building. Perfect shots within your time frame!";
      }
    } else if (lowerMessage.includes("architecture") || lowerMessage.includes("building") || lowerMessage.includes("design")) {
      if (isDestinationMode) {
        return "Excellent choice! I suggest adding these architectural gems: The Rookery Building, Chicago Board of Trade, and Marquette Building. Add these to your route!";
      } else {
        return "You can add these architectural highlights: The Rookery, Board of Trade, Marquette Building. I'll optimize the route for your time!";
      }
    } else {
      if (isDestinationMode) {
        return `Got it! Based on "${userMessage}", I'll suggest locations you can add to create the perfect Chicago Loop route!`;
      } else {
        return `Perfect! For "${userMessage}", I'll suggest locations you can add to make the most of your walk time in the Chicago Loop!`;
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCustomPrompt(inputValue);
    const currentInput = inputValue;
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(currentInput),
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleContinue = () => {
    if (selectedHistoric) {
      const place = HISTORIC_PLACES.find((p) => p.id === selectedHistoric);
      sessionStorage.setItem("goal", "historic");
      sessionStorage.setItem("goalDetail", place?.name || "");
    } else if (selectedMovie) {
      const location = MOVIE_LOCATIONS.find((l) => l.id === selectedMovie);
      sessionStorage.setItem("goal", "movie");
      sessionStorage.setItem("goalDetail", location?.name || "");
    } else if (selectedEnergy) {
      const energy = ENERGY_OPTIONS.find((m) => m.id === selectedEnergy);
      sessionStorage.setItem("goal", "energy");
      sessionStorage.setItem("goalDetail", energy?.name || "");
    } else if (selectedFood) {
      const food = FOOD_OPTIONS.find((f) => f.id === selectedFood);
      sessionStorage.setItem("goal", "food");
      sessionStorage.setItem("goalDetail", food?.name || "");
    } else if (customPrompt) {
      sessionStorage.setItem("goal", "custom");
      sessionStorage.setItem("goalDetail", customPrompt);
    }
    navigate("/walk");
  };

  const handlePresetSelection = (name: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: name,
      sender: "user",
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setCustomPrompt(name);
    setInputValue(name); // Add the preset title to the textbox
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Great choice! I've added "${name}" to your walk. You can continue to build your route or proceed to the map.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const hasSelection = selectedHistoric || selectedMovie || selectedEnergy || selectedFood || customPrompt;

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
        <h1 className="text-3xl mb-3">Where do you want to stop by along the way?</h1>
        <p className="text-sm text-muted-foreground">
                    Describe what you'd like to include, or choose a popular theme.
                  </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col overflow-y-auto">
        <div className="space-y-4 flex-1">
          {/* AI Chat - Now integrated as first category */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="w-full px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1">Customize your walk, tell me what to include.</h3>
                  
                </div>
              </div>
              
              {/* Chatbox Interface */}
              <div className="w-full space-y-3">
                {/* Chat Messages Area */}
                
                
                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    readOnly={false}
                    placeholder="e.g., Show me historic architecture and great coffee spots..."
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-[#86bbd85e]"
                  />
                  
                </div>
              </div>
            </div>

            {expandedCategory === "custom" && (
              <div className="border-t border-border px-4 py-4">
                {/* Chat Messages */}
                <div className="bg-background/50 rounded-lg p-3 mb-3 max-h-40 overflow-y-auto space-y-2">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-2 rounded-lg ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-background border border-border rounded-bl-sm"
                        }`}
                      >
                        <p className="text-xs leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex items-end gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., art museums and coffee shops..."
                    className="flex-1 bg-background border-border rounded-lg resize-none h-9 text-sm"
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="h-9 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Historic Places */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleCategory("historic")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1">Historic Places</h3>
                  <p className="text-sm text-muted-foreground">
                    Classic landmarks & architecture
                  </p>
                </div>
              </div>
              {expandedCategory === "historic" ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {expandedCategory === "historic" && (
              <div className="border-t border-border px-4 py-3 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {HISTORIC_PLACES.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => {
                        setSelectedHistoric(place.id);
                        handlePresetSelection(place.name);
                      }}
                      className={`w-full text-left overflow-hidden rounded-xl border transition-all ${
                        selectedHistoric === place.id
                          ? "border-primary shadow-sm bg-[#233642]"
                          : "border-border hover:border-primary/40 active:bg-[#233642]"
                      }`}
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <ImageWithFallback
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedHistoric === place.id && (
                          <div className="absolute inset-0 bg-primary/10"></div>
                        )}
                      </div>
                      <div className={`p-4 ${selectedHistoric === place.id ? 'bg-[#233642] text-white' : 'bg-background'}`}>
                        <p className="font-medium mb-1">{place.name}</p>
                        <p className={`text-sm leading-relaxed ${selectedHistoric === place.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {place.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Movie Themes */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleCategory("movie")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Film className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1">Movie Themes</h3>
                  <p className="text-sm text-muted-foreground">
                    Famous filming locations
                  </p>
                </div>
              </div>
              {expandedCategory === "movie" ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {expandedCategory === "movie" && (
              <div className="border-t border-border px-4 py-3 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {MOVIE_LOCATIONS.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => {
                        setSelectedMovie(location.id);
                        handlePresetSelection(location.name);
                      }}
                      className={`w-full text-left overflow-hidden rounded-xl border transition-all ${
                        selectedMovie === location.id
                          ? "border-primary shadow-sm bg-[#233642]"
                          : "border-border hover:border-primary/40 active:bg-[#233642]"
                      }`}
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <ImageWithFallback
                          src={location.imageUrl}
                          alt={location.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedMovie === location.id && (
                          <div className="absolute inset-0 bg-primary/10"></div>
                        )}
                      </div>
                      <div className={`p-4 ${selectedMovie === location.id ? 'bg-[#233642]' : 'bg-background'}`}>
                        <p className={`font-medium mb-1 ${selectedMovie === location.id ? 'text-white' : ''}`}>{location.name}</p>
                        <p className={`text-xs mb-2 ${selectedMovie === location.id ? 'text-[#86BBD8]' : 'text-primary'}`}>{location.movies}</p>
                        <p className={`text-sm leading-relaxed ${selectedMovie === location.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {location.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Energy Based */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleCategory("energy")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1">Energy Based</h3>
                  <p className="text-sm text-muted-foreground">
                    Walk based on your energy level
                  </p>
                </div>
              </div>
              {expandedCategory === "energy" ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {expandedCategory === "energy" && (
              <div className="border-t border-border px-4 py-3 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {ENERGY_OPTIONS.map((energy) => (
                    <button
                      key={energy.id}
                      onClick={() => {
                        setSelectedEnergy(energy.id);
                        handlePresetSelection(energy.name);
                      }}
                      className={`w-full text-left overflow-hidden rounded-xl border transition-all ${
                        selectedEnergy === energy.id
                          ? "border-primary shadow-sm bg-[#233642]"
                          : "border-border hover:border-primary/40 active:bg-[#233642]"
                      }`}
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <ImageWithFallback
                          src={energy.imageUrl}
                          alt={energy.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedEnergy === energy.id && (
                          <div className="absolute inset-0 bg-primary/10"></div>
                        )}
                      </div>
                      <div className={`p-4 ${selectedEnergy === energy.id ? 'bg-[#233642] text-white' : 'bg-background'}`}>
                        <p className="font-medium mb-1">{energy.name}</p>
                        <p className={`text-sm leading-relaxed ${selectedEnergy === energy.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {energy.description}
                        </p>
                      </div>
                    </button>
                  ))}</div>
              </div>
            )}
          </div>

          {/* Food Based */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleCategory("food")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1">Wine and Dine</h3>
                  <p className="text-sm text-muted-foreground">
                    Walk based on your food preferences
                  </p>
                </div>
              </div>
              {expandedCategory === "food" ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {expandedCategory === "food" && (
              <div className="border-t border-border px-4 py-3 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {FOOD_OPTIONS.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => {
                        setSelectedFood(food.id);
                        handlePresetSelection(food.name);
                      }}
                      className={`w-full text-left overflow-hidden rounded-xl border transition-all ${
                        selectedFood === food.id
                          ? "border-primary shadow-sm bg-[#233642]"
                          : "border-border hover:border-primary/40 active:bg-[#233642]"
                      }`}
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <ImageWithFallback
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedFood === food.id && (
                          <div className="absolute inset-0 bg-primary/10"></div>
                        )}
                      </div>
                      <div className={`p-4 ${selectedFood === food.id ? 'bg-[#233642] text-white' : 'bg-background'}`}>
                        <p className="font-medium mb-1">{food.name}</p>
                        <p className={`text-sm leading-relaxed ${selectedFood === food.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {food.description}
                        </p>
                      </div>
                    </button>
                  ))}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleContinue}
            disabled={!hasSelection}
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
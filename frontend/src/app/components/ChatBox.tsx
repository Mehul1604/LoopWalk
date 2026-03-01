import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm LoopWalk AI. I can help you discover interesting facts about your route, suggest alternate paths, or answer questions about Chicago's Loop!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("historic") || lowerMessage.includes("history")) {
      return "The Chicago Loop is rich in architectural history! The area became the commercial heart of Chicago after the Great Fire of 1871. Would you like to know about any specific building?";
    } else if (lowerMessage.includes("restaurant") || lowerMessage.includes("food") || lowerMessage.includes("eat")) {
      return "There are many great dining options in the Loop! From deep-dish pizza at Lou Malnati's to fine dining at The Gage. What type of cuisine are you interested in?";
    } else if (lowerMessage.includes("time") || lowerMessage.includes("long")) {
      return "Based on your current route, you're looking at approximately 30-45 minutes of walking. Would you like me to suggest a shorter or longer alternative?";
    } else if (lowerMessage.includes("shortcut") || lowerMessage.includes("faster")) {
      return "I can suggest a faster route! Would you like to skip some waypoints or take a more direct path to your destination?";
    } else if (lowerMessage.includes("photo") || lowerMessage.includes("picture")) {
      return "Great spots for photos include Cloud Gate (The Bean), the Chicago Riverwalk, and the views from the Board of Trade Building. Want specific photography tips?";
    } else {
      return "That's a great question! I'm here to help you make the most of your Chicago Loop walk. Feel free to ask about landmarks, routes, dining, or anything else you'd like to know!";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">LoopWalk AI</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-11 bg-secondary border-border rounded-xl px-4"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 flex items-center justify-center p-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

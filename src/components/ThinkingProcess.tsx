import { Brain, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ThinkingProcessProps {
  thinking: string;
}

export const ThinkingProcess = ({ thinking }: ThinkingProcessProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!thinking) return null;

  const thinkingSteps = thinking.split('\n\n').filter(step => step.trim());

  return (
    <div className="mb-4 border border-border/50 rounded-xl overflow-hidden bg-gradient-to-r from-muted/30 to-muted/20 backdrop-blur-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3 text-sm">
          <div className="relative">
            <Brain className="w-4 h-4 text-primary" />
            <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-primary animate-pulse" />
          </div>
          <span className="font-medium text-foreground">AI is thinking...</span>
          
          {/* Animated thinking dots */}
          <div className="flex gap-1 ml-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {isExpanded ? 'Hide' : 'Show'} reasoning
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-3 border-l-2 border-primary/20 pl-4">
            {thinkingSteps.map((step, index) => (
              <div 
                key={index} 
                className="text-sm text-muted-foreground leading-relaxed animate-in slide-in-from-left-2 duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0" />
                  <span>{step.trim()}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              <span>This shows how TOMO AI BUDDY processes your request</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ThinkingProcessProps {
  thinking: string;
}

export const ThinkingProcess = ({ thinking }: ThinkingProcessProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!thinking) return null;

  return (
    <div className="mb-4 border border-border rounded-lg overflow-hidden bg-[hsl(var(--thinking-bg))]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Brain className="w-4 h-4" />
          <span className="font-medium">Thinking process</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-3 pb-3 pt-0">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap border-l-2 border-muted pl-3">
            {thinking}
          </div>
        </div>
      )}
    </div>
  );
};

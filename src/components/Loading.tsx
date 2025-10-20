import { Loader2, Brain, Sparkles } from "lucide-react";

interface LoadingProps {
  type?: "spinner" | "dots" | "thinking";
  text?: string;
  size?: "sm" | "md" | "lg";
}

export const Loading = ({ 
  type = "spinner", 
  text = "Loading...", 
  size = "md" 
}: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (type === "dots") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        {text && <span className={`text-muted-foreground ${textSizeClasses[size]}`}>{text}</span>}
      </div>
    );
  }

  if (type === "thinking") {
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className={`${sizeClasses[size]} text-primary animate-pulse`} />
          <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-primary animate-bounce" />
        </div>
        {text && <span className={`text-muted-foreground ${textSizeClasses[size]}`}>{text}</span>}
        <div className="flex gap-1 ml-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {text && <span className={`text-muted-foreground ${textSizeClasses[size]}`}>{text}</span>}
    </div>
  );
};
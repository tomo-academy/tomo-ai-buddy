import { User } from "lucide-react";
import { MarkdownMessage } from "./MarkdownMessage";
import { ThinkingProcess } from "./ThinkingProcess";
import tomoLogo from "@/assets/tomo-logo.jpeg";

interface ModernMessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
}

export const ModernMessageBubble = ({ role, content, thinking }: ModernMessageBubbleProps) => {
  const isUser = role === "user";

  return (
    <div className={`w-full ${isUser ? "bg-[hsl(var(--chat-user))]" : "bg-[hsl(var(--chat-assistant))]"}`}>
      <div className="max-w-3xl mx-auto px-4 py-6 flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-card border border-border">
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <img src={tomoLogo} alt="Tomo" className="w-full h-full object-cover" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          {thinking && <ThinkingProcess thinking={thinking} />}
          {isUser ? (
            <p className="text-foreground whitespace-pre-wrap break-words">{content}</p>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <MarkdownMessage content={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export const MessageBubble = ({ role, content }: MessageBubbleProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-tomo-blue flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[70%] px-4 py-3 rounded-xl ${
          isUser
            ? "bg-tomo-blue text-white"
            : "bg-card border border-border text-foreground"
        }`}
      >
        <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-foreground" />
        </div>
      )}
    </div>
  );
};

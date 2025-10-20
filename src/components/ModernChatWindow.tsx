import { ScrollArea } from "@/components/ui/scroll-area";
import { ModernMessageBubble } from "./ModernMessageBubble";
import tomoLogo from "@/assets/tomo-logo.jpeg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
}

interface ModernChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ModernChatWindow = ({ messages, isLoading }: ModernChatWindowProps) => {
  return (
    <ScrollArea className="flex-1">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md px-4">
            <img 
              src={tomoLogo} 
              alt="Tomo" 
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-border"
            />
            <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground">
              Start a conversation by typing a message below
            </p>
          </div>
        </div>
      ) : (
        <div>
          {messages.map((message) => (
            <ModernMessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              thinking={message.thinking}
            />
          ))}
          {isLoading && (
            <div className="w-full bg-[hsl(var(--chat-assistant))]">
              <div className="max-w-3xl mx-auto px-4 py-6 flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-card border border-border">
                  <img src={tomoLogo} alt="Tomo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

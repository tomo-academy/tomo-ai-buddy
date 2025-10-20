import { ScrollArea } from "@/components/ui/scroll-area";
import { ModernMessageBubble } from "./ModernMessageBubble";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
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
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💬</span>
            </div>
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
            />
          ))}
          {isLoading && (
            <div className="w-full bg-[hsl(var(--chat-assistant))]">
              <div className="max-w-3xl mx-auto px-4 py-6 flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary">
                  <span className="text-sm">💭</span>
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

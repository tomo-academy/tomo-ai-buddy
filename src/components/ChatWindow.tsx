import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatWindow = ({ messages, isLoading }: ChatWindowProps) => {
  return (
    <ScrollArea className="flex-1 px-6 py-8">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-tomo-blue/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🐱</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">MEOW! I'm Tomo</h2>
            <p className="text-muted-foreground">
              Your AI companion, ready to chat about anything. Start a conversation below!
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-tomo-blue flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">🤔</span>
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

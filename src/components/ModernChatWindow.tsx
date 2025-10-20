import { ScrollArea } from "@/components/ui/scroll-area";
import { ModernMessageBubble } from "./ModernMessageBubble";
import { Loading } from "./Loading";
import tomoLogo from "@/assets/tomo-logo.jpeg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  timestamp?: Date;
  isStreaming?: boolean;
}

interface ModernChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ModernChatWindow = ({ messages, isLoading }: ModernChatWindowProps) => {
  return (
    <ScrollArea className="flex-1">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full px-4">
          <div className="text-center max-w-4xl mx-auto py-8 sm:py-12">
            <div className="mb-6 sm:mb-8">
              <img 
                src={tomoLogo} 
                alt="TOMO AI BUDDY" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 sm:mb-6 object-cover shadow-lg ring-2 ring-border"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4 text-foreground">
                TOMO AI BUDDY
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                How can I help you today?
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {[
                {
                  title: "Create content",
                  examples: [
                    "Write a blog post about AI",
                    "Create a story about space",
                    "Draft an email"
                  ]
                },
                {
                  title: "Get answers",
                  examples: [
                    "Explain quantum computing",
                    "What's the weather like?",
                    "How do I code in Python?"
                  ]
                },
                {
                  title: "Analyze data",
                  examples: [
                    "Summarize this document",
                    "Create a chart",
                    "Find patterns in data"
                  ]
                }
              ].map((category, idx) => (
                <div key={idx} className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-border/50">
                  <h3 className="font-medium text-foreground mb-3 text-sm sm:text-base">{category.title}</h3>
                  <div className="space-y-2">
                    {category.examples.map((example, exampleIdx) => (
                      <div key={exampleIdx} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-2">
                        "{example}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground/60">
                Start a conversation with TOMO AI BUDDY
              </p>
            </div>
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
              timestamp={message.timestamp}
              isStreaming={message.isStreaming}
            />
          ))}
          {isLoading && (
            <div className="w-full bg-muted/20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-card border border-border shadow-sm">
                  <img src={tomoLogo} alt="TOMO AI BUDDY" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm sm:text-base font-medium">TOMO AI BUDDY</span>
                  </div>
                  <Loading type="thinking" text="Thinking..." size="sm" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

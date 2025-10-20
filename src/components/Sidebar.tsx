import { Plus, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onOpenSettings: () => void;
  chatHistory: ChatHistory[];
  activeChat?: string;
}

export const Sidebar = ({
  onNewChat,
  onSelectChat,
  onOpenSettings,
  chatHistory,
  activeChat,
}: SidebarProps) => {
  return (
    <aside className="w-[200px] border-r border-border bg-card flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-tomo-blue">TOMO</h1>
        <p className="text-xs text-muted-foreground mt-1">Your AI companion</p>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full bg-tomo-blue hover:bg-tomo-blue/90 text-white font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                activeChat === chat.id
                  ? "bg-tomo-blue/10 text-tomo-blue"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Settings */}
      <div className="p-3 border-t border-border">
        <Button
          onClick={onOpenSettings}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </aside>
  );
};

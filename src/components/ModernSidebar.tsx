import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

interface ModernSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (id: string) => void;
  chatHistory: ChatHistory[];
  activeChat?: string;
  isMobile?: boolean;
}

export const ModernSidebar = ({
  isOpen,
  onClose,
  onSelectChat,
  chatHistory,
  activeChat,
  isMobile = false,
}: ModernSidebarProps) => {
  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Chat History</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                onSelectChat(chat.id);
                if (isMobile) onClose();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                activeChat === chat.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0"
      } border-r border-border bg-background transition-all duration-300 overflow-hidden flex-col hidden md:flex`}
    >
      {isOpen && <SidebarContent />}
    </aside>
  );
};

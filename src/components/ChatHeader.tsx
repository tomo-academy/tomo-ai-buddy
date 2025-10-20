import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export const ChatHeader = ({ onToggleSidebar, onNewChat }: ChatHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Tomo</h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          title="New chat"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

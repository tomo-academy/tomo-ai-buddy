import { 
  MessageSquare, 
  X, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Share, 
  Settings,
  User,
  Download,
  Sun,
  Moon,
  Monitor,
  Search,
  Folder,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTheme } from "next-themes";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  isArchived?: boolean;
  category?: string;
}

interface ModernSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat?: (id: string) => void;
  onRenameChat?: (id: string, newTitle: string) => void;
  onArchiveChat?: (id: string) => void;
  onExportChat?: (id: string) => void;
  chatHistory: ChatHistory[];
  activeChat?: string;
  isMobile?: boolean;
}

export const ModernSidebar = ({
  isOpen,
  onClose,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onArchiveChat,
  onExportChat,
  chatHistory,
  activeChat,
  isMobile = false,
}: ModernSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const { setTheme, theme } = useTheme();

  const filteredChats = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRename = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId);
    setEditTitle(currentTitle);
  };

  const saveRename = () => {
    if (editingChat && editTitle.trim() && onRenameChat) {
      onRenameChat(editingChat, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle("");
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const groupChatsByDate = (chats: ChatHistory[]) => {
    const groups: { [key: string]: ChatHistory[] } = {};
    
    chats.forEach(chat => {
      const dateKey = formatDate(chat.timestamp);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(chat);
    });

    return groups;
  };

  const renderChatItem = (chat: ChatHistory) => (
    <div
      key={chat.id}
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
        activeChat === chat.id
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50"
      }`}
      onClick={() => {
        onSelectChat(chat.id);
        if (isMobile) onClose();
      }}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0" />
      
      {editingChat === chat.id ? (
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={saveRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveRename();
            if (e.key === "Escape") {
              setEditingChat(null);
              setEditTitle("");
            }
          }}
          className="h-6 text-sm"
          autoFocus
        />
      ) : (
        <span className="truncate flex-1">{chat.title}</span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleRename(chat.id, chat.title)}>
            <Pencil className="w-4 h-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExportChat?.(chat.id)}>
            <Share className="w-4 h-4 mr-2" />
            Share & Export
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onArchiveChat?.(chat.id)}>
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDeleteChat?.(chat.id)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with New Chat Button */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">TOMO AI BUDDY</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-4">
          {Object.entries(groupChatsByDate(filteredChats)).map(([dateGroup, chats]) => (
            <div key={dateGroup}>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
                {dateGroup}
              </h3>
              <div className="space-y-1">
                {chats.map((chat) => renderChatItem(chat))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer with Settings and User */}
      <div className="border-t border-border p-3 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="w-4 h-4 mr-2" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Export all chats
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Folder className="w-4 h-4 mr-2" />
              Manage data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User className="w-4 h-4" />
              User Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0 z-50">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={`${
        isOpen ? "w-80" : "w-0"
      } border-r border-border bg-background transition-all duration-300 overflow-hidden flex-col hidden md:flex z-30`}
    >
      {isOpen && <SidebarContent />}
    </aside>
  );
};

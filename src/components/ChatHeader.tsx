import { 
  Menu, 
  Plus, 
  Settings, 
  ChevronDown, 
  Crown, 
  Zap,
  Brain,
  Search,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import tomoLogo from "@/assets/tomo-logo.jpeg";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  currentModel?: string;
  onModelChange?: (model: string) => void;
  onSettings?: () => void;
}

const models = [
  { 
    id: "tomo-4", 
    name: "TOMO-4", 
    description: "Most capable model",
    icon: Crown,
    isPro: true
  },
  { 
    id: "tomo-4-turbo", 
    name: "TOMO-4 Turbo", 
    description: "Faster and more efficient",
    icon: Zap,
    isPro: true
  },
  { 
    id: "tomo-3.5-turbo", 
    name: "TOMO-3.5 Turbo", 
    description: "Fast and reliable",
    icon: Brain,
    isPro: false
  }
];

export const ChatHeader = ({ 
  onToggleSidebar, 
  onNewChat, 
  currentModel = "tomo-4",
  onModelChange,
  onSettings
}: ChatHeaderProps) => {
  const selectedModel = models.find(m => m.id === currentModel) || models[0];

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Logo and Model Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={tomoLogo} alt="TOMO AI BUDDY" className="w-7 h-7 rounded-full object-cover" />
              <h1 className="text-lg font-semibold hidden sm:block">TOMO AI BUDDY</h1>
            </div>

            {/* Model Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 h-9">
                  <selectedModel.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{selectedModel.name}</span>
                  <span className="sm:hidden">{selectedModel.name.split('-')[0]}</span>
                  {selectedModel.isPro && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      Pro
                    </Badge>
                  )}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Choose a model</DropdownMenuLabel>
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onModelChange?.(model.id)}
                    className="flex items-center gap-3 p-3"
                  >
                    <model.icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        {model.isPro && (
                          <Badge variant="secondary" className="text-xs">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {model.description}
                      </p>
                    </div>
                    {currentModel === model.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            title="Search conversations"
            className="hidden sm:flex h-9 w-9"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            title="New chat"
            className="h-9 w-9"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Help & FAQ
              </DropdownMenuItem>
              <DropdownMenuItem>
                Keyboard shortcuts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

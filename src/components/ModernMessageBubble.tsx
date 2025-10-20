import { 
  User,
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  Edit3, 
  Share,
  MoreHorizontal,
  Sparkles,
  Check,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MarkdownMessage } from "./MarkdownMessage";
import { ThinkingProcess } from "./ThinkingProcess";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import tomoLogo from "@/assets/tomo-logo.jpeg";

interface ModernMessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  onRegenerate?: () => void;
  onEdit?: (newContent: string) => void;
  onRate?: (rating: "up" | "down") => void;
  timestamp?: Date;
  isStreaming?: boolean;
}

export const ModernMessageBubble = ({ 
  role, 
  content, 
  thinking, 
  onRegenerate, 
  onEdit, 
  onRate,
  timestamp = new Date(),
  isStreaming = false
}: ModernMessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleRate = (newRating: "up" | "down") => {
    setRating(rating === newRating ? null : newRating);
    onRate?.(newRating);
    toast.success(`Response rated as ${newRating === "up" ? "helpful" : "not helpful"}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUser = role === "user";
  const isLongContent = content.length > 500;

  return (
    <div 
      className={`group relative w-full transition-all duration-300 ease-out ${
        isUser 
          ? "bg-transparent hover:bg-muted/10" 
          : "bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 hover:from-muted/40 hover:via-muted/30 hover:to-muted/15"
      } border-b border-border/10 last:border-b-0`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Grok-style message container */}
      <div className="relative max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-4 sm:gap-6 relative">
          {/* Enhanced Avatar with status */}
          <div className="flex-shrink-0 relative">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isUser 
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg hover:shadow-xl hover:scale-105" 
                : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg hover:shadow-xl hover:scale-105"
            } ring-2 ring-background shadow-2xl`}>
              {isUser ? (
                <User className="w-6 h-6 text-white" />
              ) : (
                <img 
                  src={tomoLogo} 
                  alt="TOMO AI" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              )}
            </div>
            
            {/* Status indicator */}
            {!isUser && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                {isStreaming ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                ) : (
                  <Zap className="w-2.5 h-2.5 text-white" />
                )}
              </div>
            )}
          </div>

          {/* Message content area */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header with name, badges, timestamp, and actions */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {isUser ? "You" : "TOMO AI"}
                </h3>
                
                {/* Badges */}
                <div className="flex items-center gap-2">
                  {!isUser && (
                    <>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-full">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">AI</span>
                      </div>
                      {isStreaming && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-full">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Thinking</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(timestamp)}</span>
                </div>
              </div>

              {/* Action buttons - Fixed positioning */}
              <div className={`flex items-center gap-1 transition-all duration-200 ${
                showActions ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted/60 transition-all duration-200 relative z-10"
                  onClick={copyToClipboard}
                  title="Copy message"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>

                {!isUser && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 transition-all duration-200 relative z-10 ${
                        rating === "up" 
                          ? "text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30" 
                          : "hover:bg-muted/60"
                      }`}
                      onClick={() => handleRate("up")}
                      title="Good response"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 transition-all duration-200 relative z-10 ${
                        rating === "down" 
                          ? "text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30" 
                          : "hover:bg-muted/60"
                      }`}
                      onClick={() => handleRate("down")}
                      title="Bad response"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/60 transition-all duration-200 relative z-10"
                      onClick={onRegenerate}
                      title="Regenerate response"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/60 relative z-10">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-50">
                    <DropdownMenuItem onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    {isUser ? (
                      <DropdownMenuItem>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit message
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={onRegenerate}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Regenerate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Thinking process */}
            {thinking && !isUser && (
              <div className="mb-4">
                <ThinkingProcess thinking={thinking} />
              </div>
            )}

            {/* Message content with Grok-style formatting */}
            <div className={`grok-message-content transition-all duration-300 ${
              isLongContent && !isExpanded ? 'max-h-96 overflow-hidden' : ''
            }`}>
              {isUser ? (
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed font-medium">
                  <p className="text-base sm:text-lg leading-8 whitespace-pre-wrap break-words m-0 font-normal">
                    {content}
                  </p>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none dark:prose-invert grok-style-content">
                  <MarkdownMessage content={content} />
                </div>
              )}
            </div>

            {/* Expand/Collapse for long content */}
            {isLongContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              >
                {isExpanded ? "Show less" : "Show more"}
              </Button>
            )}
          </div>
        </div>

        {/* Grok-style gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

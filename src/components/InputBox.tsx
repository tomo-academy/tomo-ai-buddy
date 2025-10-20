import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const InputBox = ({ onSend, disabled }: InputBoxProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-2xl border border-input bg-background shadow-sm transition-all focus-within:border-primary/50 focus-within:shadow-md">
          <div className="flex items-end gap-2 p-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Tomo..."
              className="min-h-[24px] max-h-[200px] resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
              disabled={disabled}
              rows={1}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!message.trim() || disabled}
              className="h-8 w-8 rounded-full p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Tomo can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Send } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-card">
      <div className="max-w-4xl mx-auto flex gap-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Tomo..."
          className="min-h-[60px] max-h-[200px] resize-none text-[16px]"
          disabled={disabled}
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-tomo-blue hover:bg-tomo-blue/90 text-white h-[60px] w-[60px] p-0 rounded-xl"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

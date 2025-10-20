import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Mic, 
  Image, 
  Square,
  X,
  Smile,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ModernInputBoxProps {
  onSend: (message: string, attachments?: FileList) => void;
  disabled?: boolean;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export const ModernInputBox = ({ 
  onSend, 
  disabled, 
  isRecording = false,
  onStartRecording,
  onStopRecording
}: ModernInputBoxProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !disabled) {
      const fileList = attachments.length > 0 ? createFileList(attachments) : undefined;
      onSend(message, fileList);
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const createFileList = (files: File[]): FileList => {
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    return dt.files;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "*/*";
      fileInputRef.current.click();
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      onStopRecording?.();
    } else {
      onStartRecording?.();
    }
  };

  const canSend = (message.trim() || attachments.length > 0) && !disabled;

  return (
    <div className="sticky bottom-0 bg-gradient-to-b from-transparent via-background/80 to-background border-t border-border/50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6 pt-2 sm:pt-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm shadow-sm">
                <div className="flex items-center gap-2">
                  {file.type.startsWith('image/') ? (
                    <Image className="w-4 h-4" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-24 sm:max-w-32">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit}>
          <div 
            className={`relative flex items-end gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border ${
              isDragOver ? "border-primary border-2 shadow-lg" : "border-border"
            } bg-background px-3 sm:px-4 py-2 sm:py-3 shadow-lg transition-all duration-200 ${
              isDragOver ? "bg-muted/50 scale-[1.02]" : ""
            } ${message.trim() ? "shadow-xl ring-1 ring-primary/20" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Attachment Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleImageUpload}>
                  <Image className="w-4 h-4 mr-2" />
                  Upload image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFileUpload}>
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach file
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message TOMO AI BUDDY..."
                className="min-h-[24px] max-h-[200px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={disabled}
                rows={1}
              />
              
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded">
                  <div className="text-center">
                    <Paperclip className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Drop files here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1">
              {/* Voice Recording */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${isRecording ? "text-red-500" : ""}`}
                onClick={handleVoiceRecording}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              {/* Send Button */}
              <Button
                type="submit"
                disabled={!canSend}
                size="icon"
                className="h-8 w-8 rounded-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                Recording...
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ModernChatWindow } from "@/components/ModernChatWindow";
import { ModernInputBox } from "@/components/ModernInputBox";
import { ModernSidebar } from "@/components/ModernSidebar";
import { streamChat, type Message as StreamMessage } from "@/utils/streamChat";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: "1", title: "New Chat", timestamp: new Date() },
  ]);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Update chat title if it's the first message
    if (messages.length === 0) {
      const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === activeChat ? { ...chat, title } : chat
        )
      );
    }

    let assistantSoFar = "";
    const assistantId = (Date.now() + 1).toString();

    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id === assistantId) {
          return prev.map((m) => (m.id === assistantId ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { id: assistantId, role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const streamMessages: StreamMessage[] = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      await streamChat({
        messages: streamMessages,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (error) => {
          console.error("Stream error:", error);
          setIsLoading(false);
          toast.error(error);
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Failed to send message");
    }
  };

  const handleNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    setMessages([]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ModernSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectChat={handleSelectChat}
        chatHistory={chatHistory}
        activeChat={activeChat}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader onToggleSidebar={toggleSidebar} onNewChat={handleNewChat} />
        <ModernChatWindow messages={messages} isLoading={isLoading} />
        <ModernInputBox onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;

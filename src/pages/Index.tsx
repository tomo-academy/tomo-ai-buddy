import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBox } from "@/components/InputBox";
import { SettingsPanel } from "@/components/SettingsPanel";
import { streamChat, type Message as StreamMessage } from "@/utils/streamChat";
import { toast } from "sonner";

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
    { id: "1", title: "Welcome Chat", timestamp: new Date() },
  ]);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);

  // Settings state
  const [model, setModel] = useState("tomogrok-4");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

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
      const streamMessages: StreamMessage[] = [...messages, userMessage].map(m => ({ 
        role: m.role, 
        content: m.content 
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
      title: `Chat ${chatHistory.length + 1}`,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    // In a real app, load messages for this chat
    setMessages([]);
  };

  const handleOpenSettings = () => {
    // Settings panel is always visible in this layout
    console.log("Settings panel is always visible");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onOpenSettings={handleOpenSettings}
        chatHistory={chatHistory}
        activeChat={activeChat}
      />

      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <InputBox onSend={handleSendMessage} disabled={isLoading} />
      </div>

      <SettingsPanel
        model={model}
        temperature={temperature}
        maxTokens={maxTokens}
        onModelChange={setModel}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
      />
    </div>
  );
};

export default Index;

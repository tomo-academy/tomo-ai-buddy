import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBox } from "@/components/InputBox";
import { SettingsPanel } from "@/components/SettingsPanel";

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

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "MEOW! Thanks for chatting with me! I'm Tomo, your AI companion. While I'm not connected to a backend yet, I'm ready to help once you set up the integration. What would you like to talk about?",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
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

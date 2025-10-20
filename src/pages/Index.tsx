import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ModernChatWindow } from "@/components/ModernChatWindow";
import { ModernInputBox } from "@/components/ModernInputBox";
import { ModernSidebar } from "@/components/ModernSidebar";
import { SettingsPanel } from "@/components/PremiumSettingsPanel";
import { streamChat, type Message as StreamMessage } from "@/utils/streamChat";
import { createThinkingProcess, type ThinkingStep } from "@/utils/thinkingGenerator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  timestamp?: Date;
  isStreaming?: boolean;
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>("tomo-4");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(2048);
  const [isRecording, setIsRecording] = useState(false);
  const [currentThinking, setCurrentThinking] = useState<string>("");
  const thinkingGeneratorRef = useRef<ReturnType<typeof createThinkingProcess> | null>(null);
  const isMobile = useIsMobile();

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const handleSendMessage = async (content: string, attachments?: FileList) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
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

    // Handle attachments if any
    if (attachments && attachments.length > 0) {
      console.log("Attachments:", Array.from(attachments));
    }

    // Start real thinking process
    const assistantId = (Date.now() + 1).toString();
    let finalThinking = "";

    // Create assistant message with streaming state
    const initialAssistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      thinking: "",
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages((prev) => [...prev, initialAssistantMessage]);

    // Start thinking process
    thinkingGeneratorRef.current = createThinkingProcess(
      content,
      (steps: ThinkingStep[], currentText: string) => {
        setCurrentThinking(currentText);
        // Update the thinking in real-time
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, thinking: currentText }
              : m
          )
        );
      }
    );

    try {
      // Wait for thinking to complete
      finalThinking = await thinkingGeneratorRef.current.start();
      
      // Now start the actual response
      let assistantSoFar = "";

      const upsertAssistant = (nextChunk: string) => {
        assistantSoFar += nextChunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { 
                  ...m, 
                  content: assistantSoFar, 
                  thinking: finalThinking,
                  isStreaming: assistantSoFar.length === 0 // Still streaming if no content yet
                }
              : m
          )
        );
      };

      const streamMessages: StreamMessage[] = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      await streamChat({
        messages: streamMessages,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => {
          setIsLoading(false);
          // Mark as no longer streaming
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, isStreaming: false }
                : m
            )
          );
        },
        onError: (error) => {
          console.error("Stream error:", error);
          setIsLoading(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, isStreaming: false }
                : m
            )
          );
          toast.error(error);
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false }
            : m
        )
      );
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

  const handleDeleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleArchiveChat = (chatId: string) => {
    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, isArchived: true } : chat
      )
    );
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
    toast.info("Voice recording started");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Implement voice recording stop logic here
    toast.info("Voice recording stopped");
  };

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    toast.success(`Switched to ${model}`);
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleRegenerateResponse = (messageId: string) => {
    // Find the message and regenerate the response
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.role === "user") {
        // Remove the assistant message and regenerate
        setMessages(prev => prev.slice(0, messageIndex));
        handleSendMessage(userMessage.content);
      }
    }
  };

  const handleRateMessage = (messageId: string, rating: "up" | "down") => {
    // Implement message rating logic
    console.log(`Rated message ${messageId} as ${rating}`);
    toast.success(`Message rated as ${rating === "up" ? "helpful" : "not helpful"}`);
  };

  const handleExportChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      // Implementation for exporting chat
      console.log(`Exporting chat: ${chat.title}`);
      toast.info("Export feature would be implemented here");
    }
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
      {/* Mobile backdrop */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <ModernSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onArchiveChat={handleArchiveChat}
        onExportChat={handleExportChat}
        chatHistory={chatHistory}
        activeChat={activeChat}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <ChatHeader 
          onToggleSidebar={toggleSidebar} 
          onNewChat={handleNewChat}
          currentModel={currentModel}
          onModelChange={handleModelChange}
          onSettings={handleSettings}
        />
        <ModernChatWindow messages={messages} isLoading={isLoading} />
        <ModernInputBox 
          onSend={handleSendMessage} 
          disabled={isLoading}
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      </div>

      {/* Premium Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        model={currentModel}
        temperature={temperature}
        maxTokens={maxTokens}
        onModelChange={setCurrentModel}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
      />
    </div>
  );
};

export default Index;

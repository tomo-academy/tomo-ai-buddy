import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Palette,
  Globe,
  Shield,
  Database,
  Download,
  Trash2,
  Monitor,
  Moon,
  Sun,
  Crown,
  CreditCard,
  LogOut,
  X,
  ChevronRight,
  Check,
  Info,
  Bell,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  Tablet,
  Save,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onModelChange?: (model: string) => void;
  onTemperatureChange?: (temp: number) => void;
  onMaxTokensChange?: (tokens: number) => void;
}

export const SettingsPanel = ({ 
  isOpen, 
  onClose,
  model = "tomo-4",
  temperature = 0.7,
  maxTokens = 2048,
  onModelChange,
  onTemperatureChange,
  onMaxTokensChange
}: SettingsPanelProps) => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: false,
    showThinking: true,
    autoSave: true,
    dataCollection: false,
    sendUsageData: true,
    storeConversations: true,
    temperature: [temperature],
    maxTokens: maxTokens,
    language: "en",
    fontSize: "medium",
    model: model,
    userName: "User",
    email: "user@example.com",
    autoComplete: true,
    darkMode: theme === "dark",
    compactMode: false,
    showTimestamps: true,
    customPrompt: "",
    maxHistory: 50,
    responseFormat: "markdown"
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('tomo-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  const saveSettings = () => {
    localStorage.setItem('tomo-settings', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    toast.success("Settings saved successfully");
  };

  const resetSettings = () => {
    const defaultSettings = {
      notifications: true,
      soundEffects: false,
      showThinking: true,
      autoSave: true,
      dataCollection: false,
      sendUsageData: true,
      storeConversations: true,
      temperature: [0.7],
      maxTokens: 2048,
      language: "en",
      fontSize: "medium",
      model: "tomo-4",
      userName: "User",
      email: "user@example.com",
      autoComplete: true,
      darkMode: false,
      compactMode: false,
      showTimestamps: true,
      customPrompt: "",
      maxHistory: 50,
      responseFormat: "markdown"
    };
    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
    toast.info("Settings reset to defaults");
  };

  const updateSetting = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
    
    // Call parent callbacks
    if (key === "temperature" && onTemperatureChange) {
      onTemperatureChange(Array.isArray(value) ? value[0] : value as number);
    }
    if (key === "maxTokens" && onMaxTokensChange) {
      onMaxTokensChange(value as number);
    }
    if (key === "model" && onModelChange) {
      onModelChange(value as string);
    }
    
    // Apply theme immediately
    if (key === "darkMode") {
      setTheme(value ? "dark" : "light");
    }
    
    // Auto-save for important settings
    if (["darkMode", "language", "autoSave"].includes(key)) {
      setTimeout(() => {
        localStorage.setItem('tomo-settings', JSON.stringify({...settings, [key]: value}));
      }, 500);
    }
  };

  const sections = [
    { id: "general", label: "General", icon: Settings },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "language", label: "Language & Region", icon: Globe },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "data", label: "Data Controls", icon: Database },
    { id: "account", label: "Account", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard, premium: true }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex h-full">
        {/* Settings Sidebar */}
        <div className="w-80 bg-background border-r border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Settings</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 grok-hover ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                    : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                }`}
              >
                <section.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 font-medium">{section.label}</span>
                {section.premium && (
                  <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                  activeSection === section.id ? 'rotate-90' : ''
                }`} />
              </button>
            ))}
          </div>

          {/* Settings status */}
          {hasUnsavedChanges && (
            <div className="mx-4 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">You have unsaved changes</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-8">
            {activeSection === "general" && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold">General Settings</h3>
                    {hasUnsavedChanges && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={resetSettings}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button size="sm" onClick={saveSettings}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {/* Model Selection */}
                    <div>
                      <Label className="text-base font-medium">AI Model</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Choose the AI model for your conversations
                      </p>
                      <Select
                        value={settings.model}
                        onValueChange={(value) => updateSetting("model", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tomo-4">TOMO-4 (Most Capable)</SelectItem>
                          <SelectItem value="tomo-4-turbo">TOMO-4 Turbo (Faster)</SelectItem>
                          <SelectItem value="tomo-3.5-turbo">TOMO-3.5 Turbo (Balanced)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* AI Thinking Process */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Show AI Thinking Process</Label>
                        <p className="text-sm text-muted-foreground">
                          Display how TOMO AI processes your requests
                        </p>
                      </div>
                      <Switch
                        checked={settings.showThinking}
                        onCheckedChange={(checked) => updateSetting("showThinking", checked)}
                      />
                    </div>

                    <Separator />

                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about responses and updates
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications}
                        onCheckedChange={(checked) => updateSetting("notifications", checked)}
                      />
                    </div>

                    {/* Sound Effects */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Sound Effects</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sounds for interactions and notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.soundEffects}
                        onCheckedChange={(checked) => updateSetting("soundEffects", checked)}
                      />
                    </div>

                    <Separator />

                    {/* Response Creativity */}
                    <div>
                      <Label className="text-base font-medium">Response Creativity</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Higher values make responses more creative and varied
                      </p>
                      <Slider
                        value={settings.temperature}
                        onValueChange={(value) => updateSetting("temperature", value)}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Focused</span>
                        <span>{settings.temperature[0]}</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    {/* Response Length */}
                    <div>
                      <Label className="text-base font-medium">Response Length</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Maximum number of tokens in responses
                      </p>
                      <Select
                        value={settings.maxTokens.toString()}
                        onValueChange={(value) => updateSetting("maxTokens", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1024">Short (1024 tokens)</SelectItem>
                          <SelectItem value="2048">Medium (2048 tokens)</SelectItem>
                          <SelectItem value="4096">Long (4096 tokens)</SelectItem>
                          <SelectItem value="8192">Very Long (8192 tokens)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Auto-save */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Auto-save Conversations</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically save your chat history
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                      />
                    </div>

                    {/* Max History */}
                    <div>
                      <Label className="text-base font-medium">Conversation History Limit</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Maximum number of conversations to keep
                      </p>
                      <Select
                        value={settings.maxHistory.toString()}
                        onValueChange={(value) => updateSetting("maxHistory", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="25">25 conversations</SelectItem>
                          <SelectItem value="50">50 conversations</SelectItem>
                          <SelectItem value="100">100 conversations</SelectItem>
                          <SelectItem value="200">200 conversations</SelectItem>
                          <SelectItem value="-1">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Appearance</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-3 block">Theme</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "light", label: "Light", icon: Sun },
                          { id: "dark", label: "Dark", icon: Moon },
                          { id: "system", label: "System", icon: Monitor }
                        ].map((themeOption) => (
                          <button
                            key={themeOption.id}
                            onClick={() => {
                              setTheme(themeOption.id);
                              updateSetting("darkMode", themeOption.id === "dark");
                            }}
                            className={`p-4 rounded-lg border-2 transition-all grok-hover ${
                              theme === themeOption.id
                                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            <themeOption.icon className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">{themeOption.label}</div>
                            {theme === themeOption.id && (
                              <Check className="w-4 h-4 text-primary mx-auto mt-1" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Font Size */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Font Size</Label>
                      <Select
                        value={settings.fontSize}
                        onValueChange={(value) => updateSetting("fontSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Compact Mode */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce spacing and padding for more content
                        </p>
                      </div>
                      <Switch
                        checked={settings.compactMode}
                        onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                      />
                    </div>

                    {/* Show Timestamps */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Show Timestamps</Label>
                        <p className="text-sm text-muted-foreground">
                          Display time when messages were sent
                        </p>
                      </div>
                      <Switch
                        checked={settings.showTimestamps}
                        onCheckedChange={(checked) => updateSetting("showTimestamps", checked)}
                      />
                    </div>

                    <Separator />

                    {/* Device Preview */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Device Optimization</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "mobile", label: "Mobile", icon: Smartphone },
                          { id: "tablet", label: "Tablet", icon: Tablet },
                          { id: "desktop", label: "Desktop", icon: Laptop }
                        ].map((device) => (
                          <div
                            key={device.id}
                            className="p-3 rounded-lg border border-border bg-muted/20 text-center"
                          >
                            <device.icon className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-xs text-muted-foreground">{device.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Privacy & Security</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium mb-1">Data Privacy</h4>
                          <p className="text-sm text-muted-foreground">
                            Your conversations are processed securely and are not used to train our models.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "billing" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Billing & Subscription</h3>
                  
                  <div className="p-6 rounded-lg border border-border bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Crown className="w-6 h-6 text-amber-500" />
                      <div>
                        <h4 className="font-semibold">TOMO AI BUDDY Pro</h4>
                        <p className="text-sm text-muted-foreground">
                          Unlock advanced features and unlimited usage
                        </p>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
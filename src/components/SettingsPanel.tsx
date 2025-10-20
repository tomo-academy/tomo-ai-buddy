import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface SettingsPanelProps {
  model: string;
  temperature: number;
  maxTokens: number;
  onModelChange: (model: string) => void;
  onTemperatureChange: (temp: number) => void;
  onMaxTokensChange: (tokens: number) => void;
}

export const SettingsPanel = ({
  model,
  temperature,
  maxTokens,
  onModelChange,
  onTemperatureChange,
  onMaxTokensChange,
}: SettingsPanelProps) => {
  return (
    <aside className="w-[300px] border-l border-border bg-card p-6 h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Model
          </Label>
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tomogrok-4">tomogrok-4</SelectItem>
              <SelectItem value="tomogrok-3.5">tomogrok-3.5</SelectItem>
              <SelectItem value="tomogrok-mini">tomogrok-mini</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select the AI model for your conversation
          </p>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature" className="text-sm font-medium">
              Temperature
            </Label>
            <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[temperature]}
            onValueChange={(values) => onTemperatureChange(values[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Controls randomness: lower is more focused, higher is more creative
          </p>
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <Label htmlFor="maxTokens" className="text-sm font-medium">
            Max Tokens
          </Label>
          <Input
            id="maxTokens"
            type="number"
            min={1}
            max={4096}
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(parseInt(e.target.value) || 1024)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Maximum length of the response
          </p>
        </div>

        {/* Info Section */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-medium mb-2">About Tomo</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tomo is powered by advanced language models to provide helpful, accurate, and engaging conversations.
          </p>
        </div>
      </div>
    </aside>
  );
};

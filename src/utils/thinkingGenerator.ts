export interface ThinkingStep {
  id: string;
  text: string;
  duration: number;
  completed: boolean;
}

export class ThinkingGenerator {
  private steps: ThinkingStep[] = [];
  private currentStep = 0;
  private onUpdate?: (steps: ThinkingStep[], currentText: string) => void;
  private timer?: NodeJS.Timeout;

  constructor(userMessage: string, onUpdate?: (steps: ThinkingStep[], currentText: string) => void) {
    this.onUpdate = onUpdate;
    this.generateSteps(userMessage);
  }

  private generateSteps(userMessage: string): void {
    const messageLength = userMessage.length;
    const complexity = this.analyzeComplexity(userMessage);
    
    // Base thinking steps
    const baseSteps = [
      "Reading and understanding your message...",
      "Analyzing the context and intent...",
      "Considering relevant information and approaches...",
    ];

    // Add complexity-based steps
    if (complexity.isCode) {
      baseSteps.push(
        "Parsing code structure and syntax...",
        "Checking for potential issues or improvements...",
        "Preparing code examples and explanations..."
      );
    }

    if (complexity.isQuestion) {
      baseSteps.push(
        "Researching relevant information...",
        "Cross-referencing knowledge sources...",
        "Organizing the most helpful response..."
      );
    }

    if (complexity.isCreative) {
      baseSteps.push(
        "Exploring creative possibilities...",
        "Considering different perspectives and approaches...",
        "Crafting an engaging and original response..."
      );
    }

    if (complexity.isAnalytical) {
      baseSteps.push(
        "Breaking down the problem systematically...",
        "Evaluating different factors and variables...",
        "Synthesizing insights and conclusions..."
      );
    }

    // Add final steps
    baseSteps.push(
      "Structuring the response clearly...",
      "Ensuring accuracy and completeness...",
      "Finalizing the best possible answer..."
    );

    // Create steps with dynamic durations
    this.steps = baseSteps.map((text, index) => ({
      id: `step-${index}`,
      text,
      duration: this.calculateDuration(text, messageLength, complexity),
      completed: false
    }));
  }

  private analyzeComplexity(message: string): {
    isCode: boolean;
    isQuestion: boolean;
    isCreative: boolean;
    isAnalytical: boolean;
    level: 'simple' | 'medium' | 'complex';
  } {
    const lowerMessage = message.toLowerCase();
    
    const isCode = /```|function|class|import|def |const |let |var |if\s*\(|for\s*\(|while\s*\(/.test(message);
    const isQuestion = /\?|how|what|why|when|where|who|explain|tell me|can you|could you/.test(lowerMessage);
    const isCreative = /write|create|generate|story|poem|creative|design|imagine/.test(lowerMessage);
    const isAnalytical = /analyze|compare|evaluate|explain|breakdown|pros and cons|advantages|disadvantages/.test(lowerMessage);
    
    let level: 'simple' | 'medium' | 'complex' = 'simple';
    if (message.length > 200 || isCode || isAnalytical) level = 'complex';
    else if (message.length > 50 || isQuestion || isCreative) level = 'medium';

    return { isCode, isQuestion, isCreative, isAnalytical, level };
  }

  private calculateDuration(text: string, messageLength: number, complexity: any): number {
    let baseDuration = 800; // Base 800ms
    
    // Adjust based on message complexity
    if (complexity.level === 'complex') baseDuration *= 1.5;
    else if (complexity.level === 'medium') baseDuration *= 1.2;
    
    // Adjust based on step type
    if (text.includes('Reading') || text.includes('Analyzing')) baseDuration *= 0.8;
    if (text.includes('Researching') || text.includes('code')) baseDuration *= 1.3;
    if (text.includes('Finalizing')) baseDuration *= 0.6;
    
    // Add some randomness for natural feel
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    
    return Math.floor(baseDuration * randomFactor);
  }

  public start(): Promise<string> {
    return new Promise((resolve) => {
      this.processStep(0, resolve);
    });
  }

  private processStep(stepIndex: number, onComplete: (result: string) => void): void {
    if (stepIndex >= this.steps.length) {
      const finalText = this.steps.map(step => step.text).join('\n\n');
      onComplete(finalText);
      return;
    }

    const step = this.steps[stepIndex];
    this.currentStep = stepIndex;

    // Update UI with current thinking
    if (this.onUpdate) {
      const currentText = this.steps
        .slice(0, stepIndex + 1)
        .map(s => s.text)
        .join('\n\n');
      this.onUpdate([...this.steps], currentText);
    }

    // Mark step as completed after its duration
    this.timer = setTimeout(() => {
      step.completed = true;
      this.processStep(stepIndex + 1, onComplete);
    }, step.duration);
  }

  public stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  public getCurrentThinking(): string {
    return this.steps
      .slice(0, this.currentStep + 1)
      .map(step => step.text)
      .join('\n\n');
  }
}

// Factory function for easy use
export const createThinkingProcess = (
  userMessage: string,
  onUpdate?: (steps: ThinkingStep[], currentText: string) => void
): ThinkingGenerator => {
  return new ThinkingGenerator(userMessage, onUpdate);
};
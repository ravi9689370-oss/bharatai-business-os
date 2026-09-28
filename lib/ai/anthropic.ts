import { AIGenerateInput, AIGenerateOutput, AIProvider } from './provider';

export class AnthropicProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    this.model = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307';
  }

  async generate(input: AIGenerateInput): Promise<AIGenerateOutput> {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: input.maxTokens || 500,
        system: input.system,
        messages: [
          { role: 'user', content: input.user },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic API error');
    }

    return {
      text: data.content[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        estimatedCost: (data.usage?.input_tokens || 0) * 0.00025 + (data.usage?.output_tokens || 0) * 0.00125,
      },
    };
  }
}

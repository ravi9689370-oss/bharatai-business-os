import { AIGenerateInput, AIGenerateOutput, AIProvider } from './provider';

export class OpenAICompatibleProvider implements AIProvider {
  private baseURL: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.baseURL = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  async generate(input: AIGenerateInput): Promise<AIGenerateOutput> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not set');
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
        max_tokens: input.maxTokens || 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return {
      text: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
        estimatedCost: (data.usage?.prompt_tokens || 0) * 0.0005 + (data.usage?.completion_tokens || 0) * 0.0015,
      },
    };
  }
}

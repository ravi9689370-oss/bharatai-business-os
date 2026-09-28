export interface AIGenerateInput {
  feature: string;
  system: string;
  user: string;
  maxTokens?: number;
}

export interface AIGenerateOutput {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
}

export interface AIProvider {
  generate(input: AIGenerateInput): Promise<AIGenerateOutput>;
}

let cachedProvider: AIProvider | null = null;

export async function getAIProvider(): Promise<AIProvider> {
  if (cachedProvider) return cachedProvider;

  const provider = process.env.AI_PROVIDER || 'mock';

  if (provider === 'mock') {
    const { MockAIProvider } = await import('./mock');
    cachedProvider = new MockAIProvider();
  } else if (provider === 'openai-compatible') {
    const { OpenAICompatibleProvider } = await import('./openai');
    cachedProvider = new OpenAICompatibleProvider();
  } else if (provider === 'anthropic') {
    const { AnthropicProvider } = await import('./anthropic');
    cachedProvider = new AnthropicProvider();
  } else {
    const { MockAIProvider } = await import('./mock');
    cachedProvider = new MockAIProvider();
  }

  return cachedProvider;
}

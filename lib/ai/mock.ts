import { AIGenerateInput, AIGenerateOutput, AIProvider } from './provider';

export class MockAIProvider implements AIProvider {
  async generate(input: AIGenerateInput): Promise<AIGenerateOutput> {
    const responses: Record<string, string> = {
      'sales-message': 'नमस्ते! आपके लिए विशेष ऑफर - अभी 20% छूट पाएं। क्या आप रुचि रखते हैं? 🎯',
      'marketing-content': 'फेस्टिवल सीजन में अपना बिज़नेस बढ़ाएं! एक्सक्लूसिव डील के लिए अभी जुड़ें। #BharatAI #SME',
      'support-reply': 'धन्यवाद आपके सवाल के लिए। हम 24/7 आपकी सहायता के लिए यहाँ हैं। कृपया हमें बताएं कि हम कैसे मदद कर सकते हैं।',
    };

    const text = responses[input.feature] || responses['support-reply'];

    return {
      text,
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80,
        estimatedCost: 0.001,
      },
    };
  }
}

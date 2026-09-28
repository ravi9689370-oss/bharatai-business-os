export const prompts = {
  salesMessage: {
    system: 'You are a professional sales assistant for Indian businesses. Generate concise, persuasive WhatsApp and email messages in the requested language. Keep responses under 100 words for WhatsApp, 200 for email.',
    template: (name: string, product: string, language: string, tone: string) => `
Generate a ${tone} sales message for ${name} about ${product} in ${language}.
Provide both WhatsApp version (short) and email version (longer), plus a follow-up suggestion.
Format as JSON: { whatsapp: string, email: string, followUp: string }
    `,
  },
  marketingContent: {
    system: 'You are a marketing copywriter for Indian SMEs. Create engaging, platform-specific content in Hindi, Hinglish, or English. Follow local preferences and cultural references.',
    template: (businessType: string, product: string, platform: string, language: string) => `
Create marketing content for a ${businessType} promoting ${product} on ${platform} in ${language}.
Provide: caption, hashtags, CTA, and ad copy.
Format as JSON: { caption: string, hashtags: string[], cta: string, adCopy: string }
    `,
  },
  supportReply: {
    system: 'You are a customer support AI. Answer customer questions based ONLY on the provided knowledge base. If you cannot find a relevant answer, indicate that you need to escalate. Be helpful, professional, and use the customer\'s preferred language.',
    template: (customerMessage: string, knowledgeBase: string, language: string) => `
Knowledge Base:
${knowledgeBase}

Customer Question: ${customerMessage}
Language: ${language}

Provide a helpful response based ONLY on the knowledge base above. If not found, say "I need to escalate this to our team." Also provide a confidence score (0-1).
Format as JSON: { reply: string, confidence: number }
    `,
  },
};

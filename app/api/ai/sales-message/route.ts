import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookies } from '@/lib/auth';
import { getAIProvider } from '@/lib/ai/provider';
import { prompts } from '@/lib/ai/prompts';
import { checkAIMessageLimit } from '@/lib/billing/limits';
import { prisma } from '@/lib/db';

const generateSchema = z.object({
  customerName: z.string(),
  product: z.string(),
  leadStatus: z.string(),
  offerDetails: z.string(),
  language: z.enum(['en', 'hi', 'hinglish']).default('en'),
  tone: z.enum(['professional', 'friendly', 'urgent']).default('friendly'),
});

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const limit = await checkAIMessageLimit(session.organizationId);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: 'LIMIT_EXCEEDED', message: `AI message limit reached (${limit.limit}/month)` } },
      { status: 429 }
    );
  }

  const body = await request.json();
  const payload = generateSchema.parse(body);

  const provider = await getAIProvider();
  const systemPrompt = prompts.salesMessage.system + ` Use ${payload.language} language with ${payload.tone} tone.`;
  const userPrompt = prompts.salesMessage.template(payload.customerName, payload.product, payload.language, payload.tone);

  const result = await provider.generate({
    feature: 'sales-message',
    system: systemPrompt,
    user: userPrompt,
    maxTokens: 400,
  });

  await prisma.generatedContent.create({
    data: {
      organizationId: session.organizationId,
      userId: session.userId,
      type: 'SALES_MESSAGE',
      prompt: `${payload.customerName} - ${payload.product}`,
      output: result.text,
      language: payload.language,
    },
  });

  await prisma.aIUsageLog.create({
    data: {
      organizationId: session.organizationId,
      userId: session.userId,
      feature: 'sales-message',
      provider: 'mock',
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      estimatedCost: result.usage.estimatedCost,
    },
  });

  return NextResponse.json({ data: { output: result.text, usage: result.usage } });
}

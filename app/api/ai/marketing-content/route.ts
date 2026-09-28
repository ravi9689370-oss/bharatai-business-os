import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getAIProvider } from '@/lib/ai/provider';
import { prompts } from '@/lib/ai/prompts';

const generateSchema = z.object({
  businessType: z.string(),
  product: z.string(),
  platform: z.enum(['instagram', 'facebook', 'whatsapp', 'google']).default('instagram'),
  language: z.enum(['en', 'hi', 'hinglish']).default('en'),
});

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const body = await request.json();
  const payload = generateSchema.parse(body);

  const provider = await getAIProvider();
  const systemPrompt = prompts.marketingContent.system;
  const userPrompt = prompts.marketingContent.template(payload.businessType, payload.product, payload.platform, payload.language);

  const result = await provider.generate({
    feature: 'marketing-content',
    system: systemPrompt,
    user: userPrompt,
    maxTokens: 500,
  });

  await prisma.generatedContent.create({
    data: {
      organizationId: session.organizationId,
      userId: session.userId,
      type: 'MARKETING',
      prompt: `${payload.businessType} - ${payload.product}`,
      output: result.text,
      language: payload.language,
    },
  });

  return NextResponse.json({ data: { output: result.text } });
}

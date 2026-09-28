import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getAIProvider } from '@/lib/ai/provider';
import { prompts } from '@/lib/ai/prompts';

const generateSchema = z.object({
  customerMessage: z.string(),
  language: z.enum(['en', 'hi']).default('en'),
});

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const body = await request.json();
  const payload = generateSchema.parse(body);

  const kbItems = await prisma.supportKnowledgeBaseItem.findMany({
    where: { organizationId: session.organizationId, language: payload.language },
    take: 5,
  });

  const kbText = kbItems.map((item) => `${item.title}: ${item.content}`).join('\n\n');

  const provider = await getAIProvider();
  const systemPrompt = prompts.supportReply.system;
  const userPrompt = prompts.supportReply.template(payload.customerMessage, kbText, payload.language);

  const result = await provider.generate({
    feature: 'support-reply',
    system: systemPrompt,
    user: userPrompt,
    maxTokens: 350,
  });

  return NextResponse.json({ data: { reply: result.text, confidence: 0.85 } });
}

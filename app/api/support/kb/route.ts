import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

const createKBSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string().optional(),
  language: z.enum(['en', 'hi']).default('en'),
});

export async function GET(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [data, total] = await Promise.all([
    prisma.supportKnowledgeBaseItem.findMany({
      where: { organizationId: session.organizationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.supportKnowledgeBaseItem.count({ where: { organizationId: session.organizationId } }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const body = await request.json();
  const payload = createKBSchema.parse(body);

  const item = await prisma.supportKnowledgeBaseItem.create({
    data: {
      organizationId: session.organizationId,
      ...payload,
    },
  });

  return NextResponse.json({ data: item }, { status: 201 });
}

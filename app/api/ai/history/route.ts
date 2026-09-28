import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [data, total] = await Promise.all([
    prisma.generatedContent.findMany({
      where: { organizationId: session.organizationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.generatedContent.count({ where: { organizationId: session.organizationId } }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

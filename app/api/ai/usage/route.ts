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
    prisma.aIUsageLog.findMany({
      where: { organizationId: session.organizationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.aIUsageLog.count({ where: { organizationId: session.organizationId } }),
  ]);

  const totalCost = data.reduce((sum, log) => sum + log.estimatedCost, 0);

  return NextResponse.json({ data, total, page, limit, totalCost });
}

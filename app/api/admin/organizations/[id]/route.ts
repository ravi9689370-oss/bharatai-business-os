import { NextRequest, NextResponse } from 'next/request';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const org = await prisma.organization.findFirst({
    where: { id: session.organizationId },
  });

  return NextResponse.json({
    data: {
      organizationId: session.organizationId,
      organizationName: org?.name,
      stats: {
        leads: 0,
        followUps: 0,
        invoices: 0,
        aiUsage: 0,
      },
    },
  });
}

import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: { organizationId: session.organizationId },
    include: { plan: true },
  });

  return NextResponse.json({ data: subscription });
}

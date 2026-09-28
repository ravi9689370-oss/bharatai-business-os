import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = getSessionFromCookies();

  if (!session) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not signed in.' } }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  const membership = await prisma.membership.findFirst({ where: { userId: session.userId } });

  if (!user) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'User not found.' } }, { status: 401 });
  }

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, organizationId: membership?.organizationId || null });
}

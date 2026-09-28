import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const session = getSessionFromCookies();
  if (session?.globalRole !== 'PLATFORM_ADMIN') {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Admin only' } }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return NextResponse.json({ user });
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createSessionToken, loginSchema, setSessionCookie, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } }, { status: 401 });
    }

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } }, { status: 401 });
    }

    const membership = await prisma.membership.findFirst({ where: { userId: user.id } });
    const token = createSessionToken(user.id, membership?.organizationId);
    const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, membership });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    const message = error instanceof z.ZodError ? 'Validation failed.' : 'Unable to login.';
    const status = error instanceof z.ZodError ? 400 : 500;
    return NextResponse.json({ error: { code: 'LOGIN_FAILED', message } }, { status });
  }
}

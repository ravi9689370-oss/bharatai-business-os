import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword, loginSchema, registerSchema, setSessionCookie, verifyPassword, createSessionToken, getSessionFromCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existingUser) {
      return NextResponse.json({ error: { code: 'EMAIL_TAKEN', message: 'This email is already registered.' } }, { status: 409 });
    }

    const organization = await prisma.organization.create({
      data: {
        name: payload.organizationName,
        slug: payload.organizationName.toLowerCase().replace(/\s+/g, '-'),
        preferredLanguage: 'en',
      },
    });

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash: await hashPassword(payload.password),
        globalRole: 'USER',
      },
    });

    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: 'OWNER',
      },
    });

    const token = createSessionToken(user.id, organization.id);
    const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, organization });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    const message = error instanceof z.ZodError ? 'Validation failed.' : 'Unable to register.';
    const status = error instanceof z.ZodError ? 400 : 500;
    return NextResponse.json({ error: { code: 'REGISTER_FAILED', message } }, { status });
  }
}

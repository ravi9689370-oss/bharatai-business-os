import { NextResponse } from 'next/server';
import { z } from 'zod';
import { currentOrganizationPatchSchema } from '@/lib/validation';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not signed in.' } }, { status: 401 });
  }

  const membership = await prisma.membership.findFirst({ where: { userId: session.userId } });
  if (!membership) {
    return NextResponse.json({ error: { code: 'NO_ORGANIZATION', message: 'User has no organization.' } }, { status: 404 });
  }

  const organization = await prisma.organization.findUnique({ where: { id: membership.organizationId } });
  return NextResponse.json({ organization });
}

export async function PATCH(request: Request) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not signed in.' } }, { status: 401 });
  }

  const membership = await prisma.membership.findFirst({ where: { userId: session.userId } });
  if (!membership) {
    return NextResponse.json({ error: { code: 'NO_ORGANIZATION', message: 'User has no organization.' } }, { status: 404 });
  }

  const body = await request.json();
  const payload = currentOrganizationPatchSchema.parse(body);

  const organization = await prisma.organization.update({
    where: { id: membership.organizationId },
    data: payload,
  });

  return NextResponse.json({ organization });
}

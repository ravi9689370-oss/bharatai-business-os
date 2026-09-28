import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

const createCustomerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
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
    prisma.customer.findMany({
      where: { organizationId: session.organizationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where: { organizationId: session.organizationId } }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const body = await request.json();
  const payload = createCustomerSchema.parse(body);

  const customer = await prisma.customer.create({
    data: {
      organizationId: session.organizationId,
      ...payload,
    },
  });

  return NextResponse.json({ data: customer }, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionFromCookies, assertOrgAccess } from '@/lib/auth';
import { checkLeadLimit } from '@/lib/billing/limits';

const createLeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  source: z.string().optional(),
  estimatedValue: z.number().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');

  const where: any = { organizationId: session.organizationId };
  if (status) where.status = status;

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const limit = await checkLeadLimit(session.organizationId);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: 'LIMIT_EXCEEDED', message: `Lead limit reached (${limit.limit})` } },
      { status: 429 }
    );
  }

  const body = await request.json();
  const payload = createLeadSchema.parse(body);

  const lead = await prisma.lead.create({
    data: {
      organizationId: session.organizationId,
      ...payload,
    },
  });

  return NextResponse.json({ data: lead }, { status: 201 });
}

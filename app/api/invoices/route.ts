import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import { checkInvoiceLimit } from '@/lib/billing/limits';
import { calculateInvoice } from '@/lib/invoice/calc';

const createInvoiceSchema = z.object({
  customerId: z.string(),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      taxRate: z.number().default(18),
    })
  ),
  dueDate: z.string().optional(),
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
    prisma.invoice.findMany({
      where: { organizationId: session.organizationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.count({ where: { organizationId: session.organizationId } }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  const limit = await checkInvoiceLimit(session.organizationId);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: 'LIMIT_EXCEEDED', message: `Invoice limit reached (${limit.limit}/month)` } },
      { status: 429 }
    );
  }

  const body = await request.json();
  const payload = createInvoiceSchema.parse(body);

  const calc = calculateInvoice(payload.items);
  const invoiceCount = await prisma.invoice.count({ where: { organizationId: session.organizationId } });
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: session.organizationId,
      customerId: payload.customerId,
      invoiceNumber,
      status: 'UNPAID',
      subtotal: calc.subtotal,
      taxAmount: calc.taxAmount,
      total: calc.total,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    },
  });

  return NextResponse.json({ data: invoice }, { status: 201 });
}

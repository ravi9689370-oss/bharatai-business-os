import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST() {
  const session = getSessionFromCookies();
  if (!session?.organizationId) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' } }, { status: 401 });
  }

  if (process.env.BILLING_MODE === 'mock') {
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: session.organizationId },
    });

    if (subscription) {
      const updated = await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'ACTIVE' },
      });
      return NextResponse.json({ data: { status: 'success', checkout_url: '/app/billing' }, subscription: updated });
    }
  }

  return NextResponse.json({ error: { code: 'BILLING_ERROR', message: 'Billing not available' } }, { status: 400 });
}

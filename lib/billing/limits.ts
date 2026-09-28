import { prisma } from '@/lib/db';
import { getPlan } from './plans';

export async function checkAIMessageLimit(organizationId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId },
    include: { plan: true },
  });

  if (!subscription) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const plan = getPlan(subscription.plan.id);
  if (!plan) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const usage = await prisma.aIUsageLog.count({
    where: {
      organizationId,
      createdAt: {
        gte: subscription.currentPeriodStart,
        lte: subscription.currentPeriodEnd,
      },
    },
  });

  const remaining = Math.max(0, plan.aiMessageLimit - usage);
  return {
    allowed: remaining > 0,
    remaining,
    limit: plan.aiMessageLimit,
  };
}

export async function checkLeadLimit(organizationId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId },
    include: { plan: true },
  });

  if (!subscription) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const plan = getPlan(subscription.plan.id);
  if (!plan) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const count = await prisma.lead.count({
    where: { organizationId },
  });

  const remaining = Math.max(0, plan.leadLimit - count);
  return {
    allowed: remaining > 0,
    remaining,
    limit: plan.leadLimit,
  };
}

export async function checkInvoiceLimit(organizationId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId },
    include: { plan: true },
  });

  if (!subscription) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const plan = getPlan(subscription.plan.id);
  if (!plan) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const currentMonth = new Date();
  const count = await prisma.invoice.count({
    where: {
      organizationId,
      createdAt: {
        gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
      },
    },
  });

  const remaining = Math.max(0, plan.invoiceLimit - count);
  return {
    allowed: remaining > 0,
    remaining,
    limit: plan.invoiceLimit,
  };
}

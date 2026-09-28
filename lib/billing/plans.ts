export const SUBSCRIPTION_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 2999,
    currency: 'INR',
    aiMessageLimit: 500,
    leadLimit: 500,
    invoiceLimit: 100,
    features: ['Lead CRM', 'AI Messages (500/mo)', 'Basic Invoicing', 'Support KB'],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 9999,
    currency: 'INR',
    aiMessageLimit: 3000,
    leadLimit: 5000,
    invoiceLimit: 1000,
    features: ['Everything in Starter', 'AI Messages (3000/mo)', 'Advanced Reporting', 'Team Permissions'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 49999,
    currency: 'INR',
    aiMessageLimit: 20000,
    leadLimit: 999999,
    invoiceLimit: 999999,
    features: ['Unlimited Everything', 'Dedicated Support', 'API Access', 'Custom Integrations'],
  },
};

export function getPlan(planId: string) {
  return SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS] || null;
}

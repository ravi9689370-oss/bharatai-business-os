'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { formatCurrency } from '@/lib/format';

interface Subscription {
  id: string;
  status: string;
  plan: { name: string; priceMonthly: number };
  currentPeriodEnd: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/billing/subscription')
      .then((r) => r.json())
      .then((d) => {
        setSubscription(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Billing">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Current subscription</h2>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : subscription ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Plan</p>
                <p className="text-xl font-bold text-slate-900">{subscription.plan.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Monthly price</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(subscription.plan.priceMonthly)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <p className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {subscription.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Renews on</p>
                <p className="text-slate-900">{new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No active subscription</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Upgrade plan</h2>
          <p className="mb-4 text-sm text-slate-600">Choose a new plan to get more features and higher limits.</p>
          <button
            onClick={() => fetch('/api/billing/create-checkout', { method: 'POST' })}
            className="w-full rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Upgrade now
          </button>
        </div>
      </div>
    </AppShell>
  );
}

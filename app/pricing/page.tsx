'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  aiMessageLimit: number;
  leadLimit: number;
  invoiceLimit: number;
  features: string[];
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch('/api/billing/plans')
      .then((r) => r.json())
      .then((d) => setPlans(d.data || []));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">BharatAI</p>
            <h1 className="text-xl font-bold text-slate-900">Business OS</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium">Login</Link>
            <Link href="/register"><Button>Register</Button></Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Simple, Transparent Pricing</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">Choose your plan</h2>
          <p className="mt-4 text-lg text-slate-600">14-day free trial. No credit card required.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900">₹{plan.priceMonthly.toLocaleString('en-IN')}</span>
                <span className="text-slate-600">/month</span>
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
                <p>✓ {plan.aiMessageLimit.toLocaleString()} AI messages</p>
                <p>✓ {plan.leadLimit.toLocaleString()} leads</p>
                <p>✓ {plan.invoiceLimit.toLocaleString()} invoices</p>
              </div>

              <Link href="/register" className="mt-6 block">
                <Button className="w-full">Get started</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

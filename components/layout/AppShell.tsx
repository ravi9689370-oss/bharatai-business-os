'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-slate-950 p-5 text-white lg:block">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">BharatAI</p>
          <h2 className="mt-2 text-2xl font-bold">Business OS</h2>
        </div>

        <nav className="space-y-2 text-sm">
          <Link href="/app/dashboard" className="block rounded-lg px-3 py-2 hover:bg-slate-800">Dashboard</Link>
          <Link href="/app/leads" className="block rounded-lg px-3 py-2 hover:bg-slate-800">Leads</Link>
          <Link href="/app/customers" className="block rounded-lg px-3 py-2 hover:bg-slate-800">Customers</Link>
          <Link href="/app/invoices" className="block rounded-lg px-3 py-2 hover:bg-slate-800">Invoices</Link>
          <Link href="/app/ai/sales-message" className="block rounded-lg px-3 py-2 hover:bg-slate-800">AI Messages</Link>
          <Link href="/app/billing" className="block rounded-lg px-3 py-2 hover:bg-slate-800">Billing</Link>
          <Link href="/app/settings" className="block rounded-lg px-3 py-2 hover:bg-slate-800">Settings</Link>
        </nav>
      </aside>

      <main className="lg:ml-64">
        <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</p>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium">EN</button>
              <Link href="/" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Back to home</Link>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">BharatAI</p>
            <h1 className="text-xl font-bold text-slate-900">Business OS</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Login</Link>
            <Link href="/register" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Register</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Apka Business, AI Ki Taakat</p>
          <h2 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900">One AI workspace for your sales, customers, invoices and support.</h2>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Manage leads, generate WhatsApp messages, create invoices, AI-powered support replies, and more from one simple platform built for Indian SMEs.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/register"><Button>Start free</Button></Link>
            <Link href="/login"><Button className="bg-slate-200 text-slate-900 hover:bg-slate-300">Login</Button></Link>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid gap-4">
            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pipeline</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">248</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase text-emerald-700">New leads</p>
                <p className="mt-2 text-2xl font-bold text-emerald-900">36</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs uppercase text-amber-700">Invoices</p>
                <p className="mt-2 text-2xl font-bold text-amber-900">12</p>
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs uppercase text-blue-700">AI replies</p>
              <p className="mt-2 text-lg font-semibold text-blue-900">Hindi + Hinglish support suggestions ready</p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

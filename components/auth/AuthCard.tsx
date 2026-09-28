'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

type Mode = 'login' | 'register';

type AuthCardProps = {
  mode: Mode;
};

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const payload = mode === 'register'
      ? { name, email, password, organizationName }
      : { email, password };

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data?.error?.message || 'Unable to continue.');
      return;
    }

    router.push('/app/dashboard');
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-500">BharatAI</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {mode === 'login' ? 'Welcome back' : 'Create business account'}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Your name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Business name</label>
              <input value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
            </div>
          </>
        )}

        {mode === 'login' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Owner name" />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        </div>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
        <Link href={mode === 'login' ? '/register' : '/login'} className="font-semibold text-brand-500 hover:underline">
          {mode === 'login' ? 'Create account' : 'Login'}
        </Link>
      </p>
    </div>
  );
}

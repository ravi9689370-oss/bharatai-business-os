'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

export default function SalesMessagePage() {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [language, setLanguage] = useState('en');
  const [tone, setTone] = useState('friendly');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/ai/sales-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        product,
        leadStatus: 'NEW',
        offerDetails: '',
        language,
        tone,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data?.error?.message || 'Failed to generate');
      return;
    }

    setOutput(data.data?.output || '');
  }

  return (
    <AppShell title="AI Sales Message">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Generate message</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Customer name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Product/Service</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate message'}
            </Button>
          </form>
        </div>

        {output && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Generated message</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Message</p>
                <p className="mt-2 text-slate-900">{output}</p>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  alert('Copied to clipboard!');
                }}
                className="w-full bg-slate-200 text-slate-900 hover:bg-slate-300"
              >
                Copy to clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

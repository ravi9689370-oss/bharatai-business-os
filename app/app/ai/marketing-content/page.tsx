'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

export default function MarketingPage() {
  const [businessType, setBusinessType] = useState('');
  const [product, setProduct] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [language, setLanguage] = useState('en');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/ai/marketing-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessType, product, platform, language }),
    });

    const data = await res.json();
    setLoading(false);
    setOutput(data.data?.output || '');
  }

  return (
    <AppShell title="AI Marketing Content">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Generate content</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Business type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g., Retail, Clinic, Agency"
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="google">Google Ads</option>
              </select>
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </form>
        </div>

        {output && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Preview</h2>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-900">{output}</p>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(output);
                alert('Copied!');
              }}
              className="mt-4 w-full bg-slate-200 text-slate-900 hover:bg-slate-300"
            >
              Copy
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface SupportItem {
  id: string;
  title: string;
  category?: string;
  language: string;
  createdAt: string;
}

export default function SupportPage() {
  const [items, setItems] = useState<SupportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/support/kb')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Support">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Knowledge Base</h2>
        <Link href="/app/support/kb/new">
          <Button>Add article</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600">No KB articles yet. Add one to enable AI support replies.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{item.category} • {item.language}</p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

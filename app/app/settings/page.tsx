'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

interface Organization {
  name: string;
  industry?: string;
  phone?: string;
  address?: string;
  preferredLanguage: string;
}

export default function SettingsPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/organizations/current')
      .then((r) => r.json())
      .then((d) => {
        setOrg(d.organization);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch('/api/organizations/current', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(org),
    });

    setSaving(false);
    alert('Saved!');
  }

  if (loading) return <AppShell title="Settings"><p>Loading...</p></AppShell>;

  return (
    <AppShell title="Settings">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold">Organization settings</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Business name</label>
            <input
              type="text"
              value={org?.name || ''}
              onChange={(e) => setOrg({ ...org!, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Industry</label>
            <input
              type="text"
              value={org?.industry || ''}
              onChange={(e) => setOrg({ ...org!, industry: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input
              type="text"
              value={org?.phone || ''}
              onChange={(e) => setOrg({ ...org!, phone: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Language</label>
            <select
              value={org?.preferredLanguage || 'en'}
              onChange={(e) => setOrg({ ...org!, preferredLanguage: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

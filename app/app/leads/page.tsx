'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: string;
  estimatedValue?: number;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((d) => {
        setLeads(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Leads">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">All Leads</h2>
        <Link href="/app/leads/new">
          <Button>Add lead</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600">No leads yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Phone</th>
                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 font-medium text-slate-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/app/leads/${lead.id}`} className="text-brand-500 hover:underline">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lead.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">Rs {lead.estimatedValue || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

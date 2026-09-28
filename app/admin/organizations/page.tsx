'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

interface Organization {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/organizations')
      .then((r) => r.json())
      .then((d) => {
        setOrgs(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Admin: Organizations">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 font-medium text-slate-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{org.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      org.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{new Date(org.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

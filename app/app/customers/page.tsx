'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((d) => {
        setCustomers(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Customers">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">All Customers</h2>
        <Link href="/app/customers/new">
          <Button>Add customer</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600">No customers yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Phone</th>
                <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 font-medium text-slate-700">Added</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.phone || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.email || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(customer.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

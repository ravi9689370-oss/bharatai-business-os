import { AppShell } from '@/components/layout/AppShell';

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Leads</p>
          <p className="mt-2 text-3xl font-bold">128</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Follow-ups due</p>
          <p className="mt-2 text-3xl font-bold">18</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Invoices</p>
          <p className="mt-2 text-3xl font-bold">₹ 6.4L</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">AI usage</p>
          <p className="mt-2 text-3xl font-bold">280/500</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">Recent activity</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• New lead created from web form</li>
            <li>• Follow-up message drafted in Hindi</li>
            <li>• Invoice INV-2025-004 marked paid</li>
            <li>• Support KB article updated</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">Quick actions</h3>
          <div className="mt-4 grid gap-3">
            <button className="rounded-lg bg-slate-900 px-3 py-2 text-left text-sm font-medium text-white">Add lead</button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700">Generate message</button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700">New invoice</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { PayoutStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';
import {
  Users,
  Briefcase,
  FolderGit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  ShieldCheck,
  Send,
  Download,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [releasingId, setReleasingId] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickRelease = async (payoutId: string) => {
    const refId = prompt('Enter Bank / UPI Transaction Reference ID:', `TXN_OB_${Date.now()}`);
    if (!refId) return;

    setReleasingId(payoutId);
    try {
      const res = await api.post('/admin/payouts/release', { payoutId, referenceId: refId });
      if (res.success) {
        alert('Payout marked as RELEASED and contractor notified!');
        await fetchDashboard();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to release payout');
    } finally {
      setReleasingId(null);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading 2-Person Founder Ops Dashboard...
        </div>
      </PortalLayout>
    );
  }

  const { kpi = {}, pendingPayouts = [] } = data || {};

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Strip */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                2-PERSON FOUNDER OPS CONSOLE
              </span>
              <span className="text-xs font-mono text-ink-muted">Alex & Priya</span>
            </div>
            <h1 className="text-2xl font-bold text-ink-primary">Operations & Delivery Overview</h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Live tracking across Talent Bench, Client Pipeline, QA Gate, and Split Payouts.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Link
              to="/admin/talent"
              className="px-3.5 py-2 rounded-xl bg-surface-secondary text-ink-primary text-xs font-semibold hover:bg-surface-border border border-surface-border transition-colors"
            >
              Talent Bench CRM
            </Link>
            <Link
              to="/admin/projects"
              className="px-3.5 py-2 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm transition-colors"
            >
              Pipeline & Scoping
            </Link>
          </div>
        </div>

        {/* 6-Stage Operational Protocol Visualizer */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                6-Stage Collective Operational Protocol
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Part 1 Standard
              </span>
            </div>
            <span className="text-xs font-mono text-ink-muted hidden sm:inline">
              Zero Cent Drift • Founder QA Gate • 70/30 Split
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {/* Stage 1 */}
            <Link
              to="/admin/talent"
              className="p-3 rounded-xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt/40 transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                <span>STAGE 1</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="font-bold text-ink-primary group-hover:text-accent-cobalt transition-colors">
                Talent Intake
              </div>
              <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                Vetting & 72h Ping
              </div>
            </Link>

            {/* Stage 2 */}
            <Link
              to="/admin/projects"
              className="p-3 rounded-xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt/40 transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                <span>STAGE 2</span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <div className="font-bold text-ink-primary group-hover:text-accent-cobalt transition-colors">
                Client Scoping
              </div>
              <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                50/30/20 & 30% Fee
              </div>
            </Link>

            {/* Stage 3 */}
            <Link
              to="/admin/projects"
              className="p-3 rounded-xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt/40 transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                <span>STAGE 3</span>
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              </div>
              <div className="font-bold text-ink-primary group-hover:text-accent-cobalt transition-colors">
                Pod Assembly
              </div>
              <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                100% Split Balance
              </div>
            </Link>

            {/* Stage 4 */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border">
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                <span>STAGE 4</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              </div>
              <div className="font-bold text-ink-primary">
                Open-Book SOW
              </div>
              <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                E-Sign & Margin Sheet
              </div>
            </div>

            {/* Stage 5 */}
            <Link
              to="/admin/projects"
              className="p-3 rounded-xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt/40 transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                <span>STAGE 5</span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
              <div className="font-bold text-ink-primary group-hover:text-accent-cobalt transition-colors">
                Founder QA Gate
              </div>
              <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                Review Before Client
              </div>
            </Link>

            {/* Stage 6 */}
            <a
              href="#pending-payouts-table"
              className="p-3 rounded-xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt/40 transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                <span>STAGE 6</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="font-bold text-ink-primary group-hover:text-accent-cobalt transition-colors">
                Split Payouts
              </div>
              <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                TDS & Receipt Ledger
              </div>
            </a>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Active Bench Count */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              Active Bench
            </span>
            <div className="text-2xl font-extrabold font-mono text-ink-primary mt-1">
              {kpi.activeBenchCount || 0}
            </div>
            <div className="text-[11px] text-accent-emerald font-mono mt-0.5">
              {kpi.availableNowCount || 0} Available Now (72h)
            </div>
          </div>

          {/* Waitlisted Intake */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              Waitlisted Intake
            </span>
            <div className="text-2xl font-extrabold font-mono text-amber-700 mt-1">
              {kpi.waitlistedCount || 0}
            </div>
            <div className="text-[11px] text-ink-muted font-mono mt-0.5">Awaiting Vetting</div>
          </div>

          {/* Open Client Briefs */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              Draft Briefs
            </span>
            <div className="text-2xl font-extrabold font-mono text-accent-cobalt mt-1">
              {kpi.openBriefsCount || 0}
            </div>
            <div className="text-[11px] text-ink-muted font-mono mt-0.5">Needs 50/30/20 Scoping</div>
          </div>

          {/* Pending QA Gate */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              Pending Founder QA
            </span>
            <div className="text-2xl font-extrabold font-mono text-purple-700 mt-1">
              {kpi.pendingQACount || 0}
            </div>
            <div className="text-[11px] text-ink-muted font-mono mt-0.5">Awaiting QA Review</div>
          </div>

          {/* Payouts Due 48h */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              Payouts Due 48h
            </span>
            <div className="text-2xl font-extrabold font-mono text-accent-emerald mt-1">
              {kpi.payoutsDueCount || 0}
            </div>
            <div className="text-[11px] text-ink-muted font-mono mt-0.5">Client Paid & Ready</div>
          </div>
        </div>

        {/* GMV by Currency Strip */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
              Active Project Pipeline GMV (By Regional Currency)
            </span>
            <span className="text-xs font-mono text-ink-secondary">
              US • UK • Europe • India
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
              <span className="text-[10px] font-mono text-ink-muted block">USD PIPELINE</span>
              <span className="text-lg font-bold font-mono text-ink-primary">
                {formatCurrency(kpi.gmvByCurrency?.USD || 0, 'USD')}
              </span>
            </div>
            <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
              <span className="text-[10px] font-mono text-ink-muted block">GBP PIPELINE</span>
              <span className="text-lg font-bold font-mono text-ink-primary">
                {formatCurrency(kpi.gmvByCurrency?.GBP || 0, 'GBP')}
              </span>
            </div>
            <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
              <span className="text-[10px] font-mono text-ink-muted block">EUR PIPELINE</span>
              <span className="text-lg font-bold font-mono text-ink-primary">
                {formatCurrency(kpi.gmvByCurrency?.EUR || 0, 'EUR')}
              </span>
            </div>
            <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
              <span className="text-[10px] font-mono text-ink-muted block">INR PIPELINE</span>
              <span className="text-lg font-bold font-mono text-ink-primary">
                {formatCurrency(kpi.gmvByCurrency?.INR || 0, 'INR')}
              </span>
            </div>
          </div>
        </div>

        {/* Payouts Due within 48h Action Table */}
        <div id="pending-payouts-table" className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-surface-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wider font-mono">
                Contractor Payouts Ready for Release ({pendingPayouts.length})
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Client milestone payment confirmed. Founders can release to contractor banking rails.
              </p>
            </div>
            <a
              href="/api/admin/payouts/export-csv"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-surface-secondary text-ink-primary hover:bg-surface-border text-xs font-mono font-semibold flex items-center gap-1.5 border border-surface-border"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Ledger</span>
            </a>
          </div>

          {pendingPayouts.length === 0 ? (
            <div className="py-10 text-center text-xs text-ink-muted font-mono">
              No pending payouts due at this moment. All cleared milestones have been disbursed.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-surface-border text-ink-muted uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Contractor</th>
                    <th className="py-3 px-4">Project & Milestone</th>
                    <th className="py-3 px-4">Gross Payout</th>
                    <th className="py-3 px-4">India TDS</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {pendingPayouts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-ink-primary">
                          {p.podMember?.talent?.user?.fullName}
                        </div>
                        <div className="text-[10px] text-ink-muted font-mono">{p.podMember?.roleTitle}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-ink-primary">
                          {p.podMember?.project?.title}
                        </div>
                        <div className="text-[10px] text-ink-muted">{p.milestone?.title}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">{formatCurrency(p.grossAmountMinorUnits, p.currency)}</td>
                      <td className="py-3 px-4 font-mono text-rose-600">
                        {p.tdsAmountMinorUnits > 0
                          ? `-${formatCurrency(p.tdsAmountMinorUnits, p.currency)}`
                          : '₹0.00'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-accent-emerald">
                        {formatCurrency(p.netAmountMinorUnits, p.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleQuickRelease(p.id)}
                          disabled={releasingId === p.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1 shadow-sm disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>{releasingId === p.id ? 'Releasing...' : 'Release Payout'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

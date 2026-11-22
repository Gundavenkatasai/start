import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { PayoutStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { DollarSign, Download, Printer, CheckCircle2, Clock, AlertCircle, FileText, X } from 'lucide-react';

export const TalentPayouts: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  useEffect(() => {
    async function fetchPayouts() {
      try {
        const res = await api.get('/talent/payouts');
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load payouts ledger');
      } finally {
        setLoading(false);
      }
    }
    fetchPayouts();
  }, []);

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading payouts ledger...
        </div>
      </PortalLayout>
    );
  }

  const { payouts = [], summary = { releasedTotalMinorUnits: 0, pendingTotalMinorUnits: 0 } } =
    data || {};

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-emerald">
                Total Released to Bank / UPI
              </span>
              <div className="text-3xl font-extrabold font-mono text-ink-primary mt-1">
                {formatCurrency(summary.releasedTotalMinorUnits, 'USD')}
              </div>
              <span className="text-[11px] text-ink-muted">Cleared & confirmed in contractor account</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-accent-emerald flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                Pending & Escrowed Payouts
              </span>
              <div className="text-3xl font-extrabold font-mono text-ink-primary mt-1">
                {formatCurrency(summary.pendingTotalMinorUnits, 'USD')}
              </div>
              <span className="text-[11px] text-ink-muted">Locked in active sprint milestones</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-accent-cobalt flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-surface-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wider font-mono">
              Contractor Payout Ledger
            </h3>
            <span className="text-xs font-mono text-ink-muted">{payouts.length} Transactions</span>
          </div>

          {payouts.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-muted font-mono">
              No contractor payouts recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-surface-border text-ink-muted uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Project & Milestone</th>
                    <th className="py-3 px-4">Gross Payout</th>
                    <th className="py-3 px-4">India TDS</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reference / Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {payouts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink-primary">{p.projectTitle}</div>
                        <div className="text-[11px] text-ink-secondary">
                          Milestone {p.milestone?.sequenceOrder}: {p.milestone?.title}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-ink-secondary">
                        {formatCurrency(p.grossAmountMinorUnits, p.currency)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-rose-600">
                        {p.tdsAmountMinorUnits > 0
                          ? `-${formatCurrency(p.tdsAmountMinorUnits, p.currency)}`
                          : '₹0.00'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-ink-primary">
                        {formatCurrency(p.netAmountMinorUnits, p.currency)}
                      </td>
                      <td className="py-3.5 px-4">
                        <PayoutStatusBadge status={p.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setActiveReceipt(p)}
                          className="px-2.5 py-1 rounded bg-surface-secondary text-ink-primary hover:bg-surface-border text-[11px] font-mono flex items-center gap-1 border border-surface-border"
                        >
                          <FileText className="w-3 h-3 text-accent-cobalt" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Printable Receipt Modal */}
        {activeReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl p-6 sm:p-8 border border-surface-border shadow-elevated space-y-6">
              <div className="flex items-center justify-between border-b border-surface-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent-cobalt text-white font-mono font-bold text-xs flex items-center justify-center">
                    OB
                  </div>
                  <span className="font-bold text-base text-ink-primary">OpenBench Payout Receipt</span>
                </div>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="p-1 rounded-lg text-ink-muted hover:text-ink-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-2 p-3 bg-surface-subtle rounded-xl border border-surface-border">
                  <div>
                    <span className="text-ink-muted block text-[10px]">PAYOUT ID</span>
                    <span className="text-ink-primary">{activeReceipt.id.slice(0, 16)}...</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">STATUS</span>
                    <span className="text-accent-emerald font-bold">{activeReceipt.status}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">PROJECT</span>
                    <span className="text-ink-primary">{activeReceipt.projectTitle}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">DATE</span>
                    <span className="text-ink-primary">{formatDate(activeReceipt.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-b border-surface-border py-3">
                  <div className="flex justify-between">
                    <span className="text-ink-secondary">Milestone Deliverable Gross:</span>
                    <strong className="text-ink-primary">
                      {formatCurrency(activeReceipt.grossAmountMinorUnits, activeReceipt.currency)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>India TDS Deduction:</span>
                    <span>-{formatCurrency(activeReceipt.tdsAmountMinorUnits, activeReceipt.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-ink-primary pt-2 border-t border-surface-border">
                    <span>Net Amount Disbursed:</span>
                    <span className="text-accent-emerald">
                      {formatCurrency(activeReceipt.netAmountMinorUnits, activeReceipt.currency)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border text-[11px]">
                  <span className="text-ink-muted block text-[10px]">TRANSACTION REFERENCE ID:</span>
                  <span className="font-bold text-ink-primary">
                    {activeReceipt.referenceId || 'TXN_REF_PENDING_RELEASE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-surface-secondary text-ink-primary hover:bg-surface-border border border-surface-border flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

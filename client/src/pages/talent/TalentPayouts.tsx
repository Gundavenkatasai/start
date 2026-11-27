import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { PayoutStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { DollarSign, Download, Printer, CheckCircle2, Clock, AlertCircle, FileText, X, Sparkles } from 'lucide-react';

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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-emerald block mb-1">
                Total Released to Bank / UPI
              </span>
              <div className="text-3xl font-extrabold font-mono text-ink-primary">
                {formatCurrency(summary.releasedTotalMinorUnits, 'USD')}
              </div>
              <span className="text-[11px] text-ink-muted mt-1 block">Cleared & confirmed in contractor account</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent-emerald-light text-accent-emerald border border-accent-emerald-border flex items-center justify-center shadow-subtle">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt block mb-1">
                Pending & Escrowed Payouts
              </span>
              <div className="text-3xl font-extrabold font-mono text-ink-primary">
                {formatCurrency(summary.pendingTotalMinorUnits, 'USD')}
              </div>
              <span className="text-[11px] text-ink-muted mt-1 block">Locked in active sprint milestones</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border flex items-center justify-center shadow-subtle">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-3xl border border-surface-border shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-surface-border/80 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-ink-primary font-sans">
                Milestone Payout Disbursals
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Audit trail for completed deliverables with transparent fee breakdowns and tax compliance.
              </p>
            </div>
            <Badge variant="primary">{payouts.length} Transactions</Badge>
          </div>

          {payouts.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-ink-muted">
              No payout records yet. Milestone payouts appear here once deliverables are accepted.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle/80 text-ink-muted font-mono uppercase text-[10px] border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-3.5">Milestone & Project</th>
                    <th className="px-6 py-3.5">Gross Share</th>
                    <th className="px-6 py-3.5">TDS / Deductions</th>
                    <th className="px-6 py-3.5">Net Payout</th>
                    <th className="px-6 py-3.5">Disbursal Status</th>
                    <th className="px-6 py-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/80 font-mono">
                  {payouts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-ink-primary font-sans text-sm">
                          {p.milestone?.title || 'Milestone Sprint'}
                        </div>
                        <div className="text-[11px] text-ink-muted font-mono">
                          {p.projectPodMember?.project?.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-ink-primary">
                        {formatCurrency(p.grossAmountMinorUnits, p.currency)}
                      </td>
                      <td className="px-6 py-4 text-ink-secondary">
                        {p.taxWithholdingMinorUnits > 0 ? (
                          <span className="text-amber-700">
                            -{formatCurrency(p.taxWithholdingMinorUnits, p.currency)} (TDS)
                          </span>
                        ) : (
                          <span className="text-ink-muted">$0.00</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-accent-emerald text-sm">
                        {formatCurrency(p.netPayoutMinorUnits, p.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <PayoutStatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setActiveReceipt(p)}
                          className="px-3 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface-secondary text-ink-primary border border-surface-border text-xs font-sans font-medium inline-flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-accent-cobalt" />
                          <span>View Statement</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Receipt Modal */}
        {activeReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-smooth space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-surface-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-accent-cobalt flex items-center justify-center text-white font-mono font-bold text-xs">
                    OB
                  </div>
                  <h3 className="text-base font-bold text-ink-primary font-sans">
                    Payout Statement & Tax Voucher
                  </h3>
                </div>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-surface-subtle/80 border border-surface-border space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Transaction Ref:</span>
                  <span className="font-bold text-ink-primary">{activeReceipt.referenceId || 'TXN_ESCROW_RELEASE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Disbursal Date:</span>
                  <span>{formatDate(activeReceipt.releasedAt || activeReceipt.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Gross Pod Member Share:</span>
                  <span className="font-bold text-ink-primary">
                    {formatCurrency(activeReceipt.grossAmountMinorUnits, activeReceipt.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Statutory Tax Withholding:</span>
                  <span className="text-accent-rose">
                    -{formatCurrency(activeReceipt.taxWithholdingMinorUnits, activeReceipt.currency)}
                  </span>
                </div>
                <div className="pt-2 border-t border-surface-border/80 flex justify-between text-sm font-bold text-accent-emerald">
                  <span>Net Disbursed to Bank/UPI:</span>
                  <span>{formatCurrency(activeReceipt.netPayoutMinorUnits, activeReceipt.currency)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-surface-subtle hover:bg-surface-secondary text-ink-primary border border-surface-border text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="px-5 py-2 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm transition-all"
                >
                  Close Statement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

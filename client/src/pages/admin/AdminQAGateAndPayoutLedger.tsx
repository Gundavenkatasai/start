import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { PayoutStatusBadge, MilestoneStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Send,
  Download,
  FileCheck,
  DollarSign,
  MessageSquare,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminQAGateAndPayoutLedger: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // QA Modal state
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [qaAction, setQaAction] = useState<'APPROVE_FOR_CLIENT' | 'RETURN_TO_TALENT'>('APPROVE_FOR_CLIENT');
  const [qaFeedback, setQaFeedback] = useState('');
  const [reviewingQA, setReviewingQA] = useState(false);

  // Release Payout Modal
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [referenceId, setReferenceId] = useState('');
  const [releasing, setReleasing] = useState(false);

  const fetchProjectData = async () => {
    try {
      const res = await api.get('/admin/projects');
      if (res.success && res.data) {
        const found = res.data.find((p: any) => p.id === projectId);
        if (found) {
          setProject(found);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleQASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setReviewingQA(true);
    try {
      const res = await api.post(
        `/admin/projects/${projectId}/submissions/${selectedSubmission.id}/qa`,
        {
          action: qaAction,
          qaFeedback,
        }
      );

      if (res.success) {
        alert(
          qaAction === 'APPROVE_FOR_CLIENT'
            ? 'Deliverable passed Founder QA Gate and published to Client Portal!'
            : 'Deliverable returned to Talent with adjustment feedback.'
        );
        setSelectedSubmission(null);
        setQaFeedback('');
        await fetchProjectData();
      }
    } catch (err: any) {
      alert(err.message || 'QA Review failed');
    } finally {
      setReviewingQA(false);
    }
  };

  const handleReleasePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout || !referenceId.trim()) return;

    setReleasing(true);
    try {
      const res = await api.post('/admin/payouts/release', {
        payoutId: selectedPayout.id,
        referenceId,
      });

      if (res.success) {
        alert('Payout marked as RELEASED! Contractor notified with transaction reference ID.');
        setSelectedPayout(null);
        setReferenceId('');
        await fetchProjectData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to release payout');
    } finally {
      setReleasing(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading Founder QA Gate & Payout Ledger...
        </div>
      </PortalLayout>
    );
  }

  if (error || !project) {
    return (
      <PortalLayout>
        <div className="p-8 sm:p-12 bg-white rounded-3xl border border-surface-border text-center space-y-4 shadow-subtle">
          <AlertCircle className="w-8 h-8 text-accent-rose mx-auto" />
          <h2 className="text-xl font-bold font-sans">{error || 'Project not found'}</h2>
          <Link to="/admin/projects" className="text-xs font-mono text-accent-cobalt inline-flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects Pipeline</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  // Collect all milestones across project
  const allMilestones = project.milestones || [];

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/admin/projects"
              className="text-xs font-mono text-ink-muted hover:text-ink-primary inline-flex items-center gap-1 mb-2.5 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Pipeline</span>
            </Link>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="purple" dot pulse>
                FOUNDER QA GATE & LEDGER
              </Badge>
              <span className="text-xs font-mono text-ink-muted">
                Gross: {formatCurrency(project.grossBudgetMinorUnits, project.currency)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary font-sans">{project.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin/payouts/export-csv"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-secondary text-ink-primary text-xs font-mono font-semibold flex items-center gap-1.5 border border-surface-border transition-all shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Ledger</span>
            </a>
          </div>
        </div>

        {/* Section 1: Founder QA Review Gate */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-ink-primary font-sans">
                Founder QA Review Gate
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                Review talent deliverables before they are exposed to the client. Two founders personally guarantee quality.
              </p>
            </div>
            <Badge variant="primary">{allMilestones.length} Sprints</Badge>
          </div>

          <div className="space-y-4">
            {allMilestones.map((m: any) => (
              <div key={m.id} className="p-5 sm:p-6 rounded-2xl border border-surface-border bg-surface-subtle/70 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-ink-muted uppercase">MILESTONE 0{m.sequenceOrder}</span>
                    <h4 className="text-sm font-bold text-ink-primary font-sans">{m.title}</h4>
                  </div>
                  <MilestoneStatusBadge status={m.status} />
                </div>

                {/* Submissions in this milestone */}
                {m.deliverableSubmissions && m.deliverableSubmissions.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-surface-border/80">
                    {m.deliverableSubmissions.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="p-3.5 bg-white rounded-xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-subtle"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-3.5 h-3.5 text-accent-cobalt" />
                            <a
                              href={sub.deliverableUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-accent-cobalt hover:underline font-mono"
                            >
                              {sub.deliverableUrl}
                            </a>
                            <Badge variant="secondary" size="sm">
                              {sub.qaStatus}
                            </Badge>
                          </div>
                          {sub.notes && <p className="text-ink-secondary text-[11px] leading-relaxed">Notes: "{sub.notes}"</p>}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {sub.qaStatus === 'PENDING_QA' ? (
                            <button
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setQaAction('APPROVE_FOR_CLIENT');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm transition-all"
                            >
                              Founder QA Review
                            </button>
                          ) : (
                            <Badge variant="success" dot>
                              QA Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-ink-muted italic">
                    No deliverables submitted yet for this sprint.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Split Payout Ledger per Contractor */}
        <div className="bg-white rounded-3xl border border-surface-border shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-surface-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-ink-primary font-sans">
                Contractor Split Payout Ledger
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Exact payouts in minor units with India TDS (Section 194J 10% / Section 194C 1%).
              </p>
            </div>
            <Badge variant="success">Zero Drift Money Math</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle/80 border-b border-surface-border text-ink-muted uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Milestone</th>
                  <th className="py-3.5 px-6">Contractor & Role</th>
                  <th className="py-3.5 px-6">Gross Payout</th>
                  <th className="py-3.5 px-6">India TDS</th>
                  <th className="py-3.5 px-6">Net Payout</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/80 font-mono">
                {allMilestones.flatMap((m: any) =>
                  (m.payouts || []).map((p: any) => (
                    <tr key={p.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-4 px-6 font-mono">
                        M0{m.sequenceOrder} ({m.percentOfBudget}%)
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-ink-primary font-sans text-sm">
                          {p.podMember?.talent?.user?.fullName || 'Assigned Contractor'}
                        </div>
                        <div className="text-[11px] text-ink-muted font-mono">{p.podMember?.roleTitle}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-ink-primary">{formatCurrency(p.grossAmountMinorUnits, p.currency)}</td>
                      <td className="py-4 px-6 text-accent-rose">
                        {p.tdsAmountMinorUnits > 0
                          ? `-${formatCurrency(p.tdsAmountMinorUnits, p.currency)}`
                          : '₹0.00'}
                      </td>
                      <td className="py-4 px-6 font-bold text-accent-emerald text-sm">
                        {formatCurrency(p.netAmountMinorUnits, p.currency)}
                      </td>
                      <td className="py-4 px-6">
                        <PayoutStatusBadge status={p.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        {p.status === 'CLIENT_PAID' ? (
                          <button
                            onClick={() => {
                              setSelectedPayout(p);
                              setReferenceId(`TXN_OB_${Date.now()}`);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-accent-emerald text-white text-xs font-semibold hover:bg-accent-emerald-hover shadow-sm flex items-center gap-1.5 ml-auto transition-all"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Release Payout</span>
                          </button>
                        ) : p.status === 'RELEASED' ? (
                          <span className="text-[11px] font-mono text-accent-emerald">
                            Ref: {p.referenceId?.slice(0, 14)}...
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-ink-muted">Locked in Escrow</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QA Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-smooth space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-surface-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent-cobalt" />
                  <h3 className="text-base font-bold text-ink-primary font-sans">Founder QA Gate Sign-Off</h3>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleQASubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-ink-muted block text-[11px]">DELIVERABLE URL</span>
                  <a
                    href={selectedSubmission.deliverableUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-cobalt font-bold underline break-all flex items-center gap-1"
                  >
                    <span>{selectedSubmission.deliverableUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-ink-primary">QA Verdict</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQaAction('APPROVE_FOR_CLIENT')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        qaAction === 'APPROVE_FOR_CLIENT'
                          ? 'bg-accent-emerald-light border-accent-emerald text-emerald-950 font-bold shadow-subtle'
                          : 'bg-white border-surface-border text-ink-secondary hover:bg-surface-subtle'
                      }`}
                    >
                      Approve for Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setQaAction('RETURN_TO_TALENT')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        qaAction === 'RETURN_TO_TALENT'
                          ? 'bg-accent-rose-light border-accent-rose text-rose-950 font-bold shadow-subtle'
                          : 'bg-white border-surface-border text-ink-secondary hover:bg-surface-subtle'
                      }`}
                    >
                      Return to Talent
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    QA Review Feedback / Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={qaFeedback}
                    onChange={(e) => setQaFeedback(e.target.value)}
                    placeholder="Enter QA verification checklist notes or adjustments required..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border/80">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewingQA}
                    className="px-5 py-2.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow disabled:opacity-50 transition-all"
                  >
                    {reviewingQA ? 'Submitting QA...' : 'Confirm QA Verdict'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Release Payout Modal */}
        {selectedPayout && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-smooth space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-surface-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent-emerald" />
                  <h3 className="text-base font-bold text-ink-primary font-sans">Disburse Contractor Payout</h3>
                </div>
                <button onClick={() => setSelectedPayout(null)} className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleReleasePayout} className="space-y-4 text-xs">
                <div className="p-4 bg-surface-subtle/80 rounded-2xl border border-surface-border space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-ink-secondary">Contractor:</span>
                    <strong className="text-ink-primary font-sans">{selectedPayout.podMember?.talent?.user?.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-secondary">Net Disbursed:</span>
                    <strong className="text-accent-emerald font-mono text-sm">
                      {formatCurrency(selectedPayout.netAmountMinorUnits, selectedPayout.currency)}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    Bank / UPI Transaction Reference ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="e.g. UTR123456789 or WISE_TRANSFER_987"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono transition-all shadow-subtle"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border/80">
                  <button
                    type="button"
                    onClick={() => setSelectedPayout(null)}
                    className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={releasing}
                    className="px-5 py-2.5 rounded-xl bg-accent-emerald text-white text-xs font-semibold hover:bg-accent-emerald-hover shadow-sm hover:shadow-glow disabled:opacity-50 transition-all"
                  >
                    {releasing ? 'Releasing...' : 'Release & Disburse Payout'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

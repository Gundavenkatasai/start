import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { MilestoneStatusBadge, ProjectStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  FileCheck,
  PlusCircle,
  X,
} from 'lucide-react';

export const ClientProjectWorkspace: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Milestone Checkout Modal
  const [checkoutMilestone, setCheckoutMilestone] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Deliverable Review Modal (Approve or Request Revision)
  const [reviewMilestone, setReviewMilestone] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REQUEST_REVISION'>('APPROVE');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewing, setReviewing] = useState(false);

  // Change Order Modal (When revision cap is reached)
  const [showChangeOrderModal, setShowChangeOrderModal] = useState(false);
  const [changeOrderTitle, setChangeOrderTitle] = useState('');
  const [changeOrderDesc, setChangeOrderDesc] = useState('');
  const [changeOrderAmount, setChangeOrderAmount] = useState(1500); // major units
  const [submittingCO, setSubmittingCO] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/client/projects/${projectId}`);
      if (res.success && res.data) {
        setProject(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Handle Milestone Checkout
  const handleMilestonePayment = async () => {
    if (!checkoutMilestone) return;
    setPaying(true);

    try {
      // 1. Create payment intent
      const intentRes = await api.post(`/client/projects/${projectId}/milestones/checkout`, {
        milestoneId: checkoutMilestone.id,
      });

      // 2. Confirm payment (sandbox/mock fallback handles instantly)
      const confirmRes = await api.post(`/client/projects/${projectId}/milestones/confirm`, {
        milestoneId: checkoutMilestone.id,
        paymentIntentId: intentRes.data?.paymentIntentId || `sandbox_pay_${Date.now()}`,
        provider: intentRes.data?.provider || 'SANDBOX',
      });

      if (confirmRes.success) {
        setPaymentSuccess(true);
        setTimeout(async () => {
          setCheckoutMilestone(null);
          setPaymentSuccess(false);
          await fetchProject();
        }, 1500);
      }
    } catch (err: any) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setPaying(false);
    }
  };

  // Handle Deliverable Review (Approve or Request Revision)
  const handleReviewDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewMilestone) return;

    setReviewing(true);
    try {
      const res = await api.post(
        `/client/projects/${projectId}/milestones/${reviewMilestone.id}/review`,
        {
          action: reviewAction,
          feedback: reviewFeedback,
        }
      );

      if (res.success) {
        setReviewMilestone(null);
        setReviewFeedback('');
        await fetchProject();
      }
    } catch (err: any) {
      if (err.data?.code === 'REVISION_CAP_EXCEEDED') {
        alert(err.message);
        setReviewMilestone(null);
        setShowChangeOrderModal(true);
      } else {
        alert(err.message || 'Review submission failed');
      }
    } finally {
      setReviewing(false);
    }
  };

  // Handle Change Order Submission
  const handleChangeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCO(true);

    try {
      const res = await api.post(`/client/projects/${projectId}/change-orders`, {
        title: changeOrderTitle,
        description: changeOrderDesc,
        additionalAmountMinorUnits: changeOrderAmount * 100,
      });

      if (res.success) {
        alert('Change Order submitted! Founder Ops will review and scope the additional sprint.');
        setShowChangeOrderModal(false);
        setChangeOrderTitle('');
        setChangeOrderDesc('');
        await fetchProject();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit change order');
    } finally {
      setSubmittingCO(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading project workspace...
        </div>
      </PortalLayout>
    );
  }

  if (error || !project) {
    return (
      <PortalLayout>
        <div className="p-8 bg-white rounded-2xl border border-surface-border text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">{error || 'Project not found'}</h2>
          <Link
            to="/client/dashboard"
            className="text-xs font-mono text-accent-cobalt inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Client Dashboard</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Workspace Top Bar */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/client/dashboard"
              className="text-xs font-mono text-ink-muted hover:text-ink-primary inline-flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Projects Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <ProjectStatusBadge status={project.status} />
              <span className="text-xs font-mono text-ink-muted">
                Revision Cap: <strong>{project.revisionCapPerMilestone} rounds / milestone</strong>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink-primary">{project.title}</h1>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] font-mono text-ink-muted uppercase block">Total Project Contract</span>
            <div className="text-2xl font-extrabold font-mono text-ink-primary">
              {formatCurrency(project.grossBudgetMinorUnits, project.currency)}
            </div>
            <span className="text-[11px] font-mono text-accent-emerald">
              Milestone Escrow (50% / 30% / 20%)
            </span>
          </div>
        </div>

        {/* Milestone Tracker & Deliverable Review Gate */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wider font-mono">
              Milestones, Escrow Deposits & Founder QA Review
            </h3>
            <span className="text-xs font-mono text-ink-muted">
              {project.milestones?.length || 3} Deliverable Sprints
            </span>
          </div>

          <div className="space-y-4">
            {project.milestones?.map((m: any) => {
              const approvedDeliverable = m.deliverableSubmissions?.[0]; // Client sees QA-approved deliverables
              const isPaid = !!m.paidAt;
              const revisionsUsed = m.revisionsUsed || 0;
              const capReached = revisionsUsed >= project.revisionCapPerMilestone;

              return (
                <div
                  key={m.id}
                  className="p-5 rounded-xl border border-surface-border bg-surface-subtle space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {m.sequenceOrder}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-ink-primary">{m.title}</h4>
                        <p className="text-xs text-ink-secondary mt-0.5">
                          {m.deliverablesSummary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <MilestoneStatusBadge status={m.status} />
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-ink-primary">
                          {formatCurrency(m.amountMinorUnits, project.currency)}
                        </div>
                        <span className="text-[10px] font-mono text-ink-muted">{m.percentOfBudget}% Escrow</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Payment Strip */}
                  <div className="p-3 bg-white rounded-lg border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {isPaid ? (
                        <span className="text-emerald-700 font-mono font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Deposit Paid ({formatDate(m.paidAt)})</span>
                        </span>
                      ) : (
                        <span className="text-amber-800 font-mono font-medium">
                          Deposit Required to Start Sprint
                        </span>
                      )}

                      <span className="text-ink-muted font-mono">
                        Revisions: <strong>{revisionsUsed} / {project.revisionCapPerMilestone}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Pay Deposit Button if not paid */}
                      {!isPaid && (
                        <button
                          onClick={() => setCheckoutMilestone(m)}
                          className="px-3.5 py-1.5 rounded-lg bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay {m.percentOfBudget}% Deposit ({formatCurrency(m.amountMinorUnits, project.currency)})</span>
                        </button>
                      )}

                      {/* Review Deliverable Button if submitted to client */}
                      {m.status === 'SUBMITTED_TO_CLIENT' && (
                        <button
                          onClick={() => setReviewMilestone(m)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Review & Approve Milestone</span>
                        </button>
                      )}

                      {m.status === 'APPROVED_PAID' && (
                        <span className="text-xs font-mono font-bold text-accent-emerald flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Signed-Off</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* QA-Approved Deliverables Preview */}
                  {approvedDeliverable && (
                    <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-accent-emerald" />
                          <a
                            href={approvedDeliverable.deliverableUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-emerald-800"
                          >
                            Founder QA-Approved Deliverable Link
                          </a>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          QA PASSED
                        </span>
                      </div>
                      {approvedDeliverable.notes && (
                        <p className="text-ink-secondary text-[11px]">
                          Release Notes: "{approvedDeliverable.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Change Orders Section */}
        {project.changeOrders && project.changeOrders.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-3">
            <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wider font-mono">
              Funded Change Orders
            </h3>
            <div className="space-y-2">
              {project.changeOrders.map((co: any) => (
                <div
                  key={co.id}
                  className="p-3.5 bg-surface-subtle rounded-xl border border-surface-border flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-ink-primary">{co.title}</div>
                    <div className="text-ink-secondary text-[11px]">{co.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-accent-cobalt">
                      +{formatCurrency(co.additionalAmountMinorUnits, project.currency)}
                    </div>
                    <span className="text-[10px] font-mono text-ink-muted">{co.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone Payment Modal */}
        {checkoutMilestone && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-surface-border shadow-elevated space-y-5">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent-cobalt" />
                  <h3 className="text-base font-bold text-ink-primary">
                    Milestone Escrow Deposit
                  </h3>
                </div>
                <button
                  onClick={() => setCheckoutMilestone(null)}
                  className="p-1 rounded-lg text-ink-muted hover:text-ink-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {paymentSuccess ? (
                <div className="py-6 text-center space-y-2 text-accent-emerald">
                  <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                  <div className="text-base font-bold">Escrow Payment Verified!</div>
                  <p className="text-xs text-ink-secondary">
                    Receipt generated. Sprint is now activated for the pod.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border space-y-1">
                    <div className="text-ink-muted font-mono uppercase text-[10px]">
                      MILESTONE 0{checkoutMilestone.sequenceOrder}
                    </div>
                    <div className="text-sm font-bold text-ink-primary">{checkoutMilestone.title}</div>
                    <div className="text-lg font-bold font-mono text-accent-cobalt pt-1">
                      {formatCurrency(checkoutMilestone.amountMinorUnits, project.currency)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-accent-cobalt" />
                      <span>Unified Payment Rails:</span>
                    </div>
                    <p className="text-[11px] text-blue-900">
                      {project.currency === 'INR'
                        ? 'Processed via Razorpay (UPI, Netbanking, Cards).'
                        : 'Processed via Stripe (Cards, Apple Pay, Wire).'}
                    </p>
                    <span className="text-[10px] font-mono text-accent-cobalt block pt-1">
                      (Test Sandbox Mode Active — One-click verification)
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                    <button
                      type="button"
                      onClick={() => setCheckoutMilestone(null)}
                      className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={paying}
                      onClick={handleMilestonePayment}
                      className="px-5 py-2.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {paying
                          ? 'Authorizing Escrow...'
                          : `Confirm & Pay ${formatCurrency(checkoutMilestone.amountMinorUnits, project.currency)}`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deliverable Review Modal (Approve or Request Revision) */}
        {reviewMilestone && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-surface-border shadow-elevated space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <h3 className="text-base font-bold text-ink-primary">
                  Review Deliverables for M{reviewMilestone.sequenceOrder}
                </h3>
                <button
                  onClick={() => setReviewMilestone(null)}
                  className="p-1 rounded-lg text-ink-muted hover:text-ink-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleReviewDeliverable} className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="block font-semibold text-ink-primary">Your Review Decision *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewAction('APPROVE')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        reviewAction === 'APPROVE'
                          ? 'bg-emerald-50 border-accent-emerald text-emerald-950 font-bold'
                          : 'bg-white border-surface-border text-ink-secondary hover:bg-surface-subtle'
                      }`}
                    >
                      Approve & Release
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewAction('REQUEST_REVISION')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        reviewAction === 'REQUEST_REVISION'
                          ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                          : 'bg-white border-surface-border text-ink-secondary hover:bg-surface-subtle'
                      }`}
                    >
                      Request Revision
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted">
                    Revision rounds used: {reviewMilestone.revisionsUsed || 0} /{' '}
                    {project.revisionCapPerMilestone} cap
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">Feedback / Notes</label>
                  <textarea
                    rows={3}
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Enter approval confirmation or specific revision notes for the pod..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={() => setReviewMilestone(null)}
                    className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewing}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                  >
                    {reviewing ? 'Recording Review...' : 'Submit Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Order Modal */}
        {showChangeOrderModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-surface-border shadow-elevated space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Revision Cap Exceeded — Submit Change Order</span>
                </div>
                <button
                  onClick={() => setShowChangeOrderModal(false)}
                  className="p-1 rounded-lg text-ink-muted hover:text-ink-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-ink-secondary">
                The agreed 2-round revision cap has been reached for this milestone. To request additional scope
                or architectural changes, please submit a formal funded Change Order.
              </p>

              <form onSubmit={handleChangeOrder} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1">Change Order Title</label>
                  <input
                    type="text"
                    required
                    value={changeOrderTitle}
                    onChange={(e) => setChangeOrderTitle(e.target.value)}
                    placeholder="e.g. Additional Integration & UI Enhancements"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">Scope Description</label>
                  <textarea
                    required
                    rows={3}
                    value={changeOrderDesc}
                    onChange={(e) => setChangeOrderDesc(e.target.value)}
                    placeholder="Describe the additional requested revisions or features..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Additional Budget ({project.currency})
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={100}
                    value={changeOrderAmount}
                    onChange={(e) => setChangeOrderAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={() => setShowChangeOrderModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCO}
                    className="px-5 py-2.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm disabled:opacity-50"
                  >
                    {submittingCO ? 'Submitting...' : 'Submit Change Order'}
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

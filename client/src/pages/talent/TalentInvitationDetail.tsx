import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FileText,
  DollarSign,
  Scale,
  Users,
  Calendar,
  Lock,
} from 'lucide-react';

export const TalentInvitationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // E-Sign Form state
  const [signedName, setSignedName] = useState('');
  const [eSigning, setESigning] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declining, setDeclining] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await api.get(`/talent/invitations/${id}`);
        if (res.success && res.data) {
          setData(res.data);
          if (res.data.membership.signedName) {
            setSignedName(res.data.membership.signedName);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load project offer transparency sheet');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleAcceptAndSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signedName.trim()) {
      alert('Please type your full legal name to electronically sign this SOW.');
      return;
    }

    setESigning(true);
    try {
      const res = await api.post(`/talent/invitations/${id}/accept`, { signedName });
      if (res.success) {
        alert('Scope of Work successfully e-signed! You are now part of this project pod.');
        navigate(`/talent/projects/${data.project.id}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to accept invitation');
    } finally {
      setESigning(false);
    }
  };

  const handleDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineReason.trim()) return;

    setDeclining(true);
    try {
      const res = await api.post(`/talent/invitations/${id}/decline`, { declineReason });
      if (res.success) {
        alert('Invitation declined.');
        navigate('/talent/dashboard');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to decline');
    } finally {
      setDeclining(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading Open-Book Transparency Sheet...
        </div>
      </PortalLayout>
    );
  }

  if (error || !data) {
    return (
      <PortalLayout>
        <div className="p-8 rounded-2xl bg-white border border-surface-border text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">{error || 'Invitation Not Found'}</h2>
          <Link
            to="/talent/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cobalt"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const { membership, project, transparencySheet } = data;
  const isAccepted = membership.inviteStatus === 'ACCEPTED';
  const isDeclined = membership.inviteStatus === 'DECLINED';

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Back Link */}
        <Link
          to="/talent/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-secondary hover:text-ink-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Hero Transparency Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-accent-cobalt border border-blue-200">
                  OPEN-BOOK SOW OFFER
                </span>
                <span className="text-xs font-mono text-ink-muted">
                  Client: {project.client?.companyName} ({project.client?.billingCountry})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary">
                {project.title}
              </h1>
              <p className="text-xs sm:text-sm text-ink-secondary mt-1 max-w-2xl leading-relaxed">
                {project.scopeSummary}
              </p>
            </div>

            <div className="text-left sm:text-right bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shrink-0">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">
                YOUR GUARANTEED FIXED PAYOUT
              </span>
              <div className="text-2xl font-extrabold font-mono text-emerald-950 mt-0.5">
                {formatCurrency(membership.payoutMinorUnits, project.currency)}
              </div>
              <span className="text-[11px] font-mono text-emerald-700">
                {membership.sharePercent}% of gross client budget
              </span>
            </div>
          </div>

          {/* Gross Budget & Platform Margin Transparency Sheet */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-accent-cobalt" />
              <span>Full Project Budget Transparency Sheet</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border">
                <div className="text-xs text-ink-secondary">Gross Client Contract</div>
                <div className="text-xl font-bold font-mono text-ink-primary mt-1">
                  {formatCurrency(transparencySheet.grossBudgetMinorUnits, project.currency)}
                </div>
                <div className="text-[11px] text-ink-muted mt-1">100% of client invoice</div>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border">
                <div className="text-xs text-ink-secondary">
                  Platform & Ops Fee ({transparencySheet.platformMarginPercent}%)
                </div>
                <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                  {formatCurrency(transparencySheet.platformBreakdown.totalPlatformMinorUnits, project.currency)}
                </div>
                <div className="text-[11px] text-ink-muted mt-1">Sales, founder PM & QA reserve</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-xs text-emerald-800">
                  Total Execution Pod Pool ({transparencySheet.podTotalSharePercent}%)
                </div>
                <div className="text-xl font-bold font-mono text-emerald-950 mt-1">
                  {formatCurrency(
                    transparencySheet.grossBudgetMinorUnits - transparencySheet.platformBreakdown.totalPlatformMinorUnits,
                    project.currency
                  )}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">Directly allocated to specialists</div>
              </div>
            </div>

            {/* Platform Itemized Sub-split */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-xs">
              <div className="text-ink-secondary font-mono font-semibold mb-2">
                Itemized 30% Platform Breakdown:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-ink-muted">Sales & Client Ops (12%):</span>{' '}
                  <strong className="font-mono text-ink-primary">
                    {formatCurrency(transparencySheet.platformBreakdown.salesAndOpsMinorUnits, project.currency)}
                  </strong>
                </div>
                <div>
                  <span className="text-ink-muted">Founder PM & QA (10%):</span>{' '}
                  <strong className="font-mono text-ink-primary">
                    {formatCurrency(transparencySheet.platformBreakdown.pmAndQaMinorUnits, project.currency)}
                  </strong>
                </div>
                <div>
                  <span className="text-ink-muted">Warranty Reserve (8%):</span>{' '}
                  <strong className="font-mono text-ink-primary">
                    {formatCurrency(transparencySheet.platformBreakdown.reserveMarginMinorUnits, project.currency)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Pod Roles & Effort Weights */}
          <div className="pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-cobalt" />
              <span>Pod Roles & Assigned Weights</span>
            </h3>

            <div className="space-y-2">
              {transparencySheet.allRoles.map((role: any) => {
                const isYou = role.talentId === membership.talentId;
                return (
                  <div
                    key={role.talentId}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-mono ${
                      isYou
                        ? 'bg-blue-50/70 border-accent-cobalt text-accent-cobalt font-bold'
                        : 'bg-white border-surface-border text-ink-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>{role.roleTitle}</span>
                      {isYou && (
                        <span className="px-1.5 py-0.2 rounded bg-accent-cobalt text-white text-[10px]">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{role.sharePercent}% gross share</span>
                      <strong className="text-ink-primary text-sm">
                        {formatCurrency(role.payoutMinorUnits, project.currency)}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 50/30/20 Milestone Payout Schedule */}
          <div className="pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-cobalt" />
              <span>50% / 30% / 20% Milestone Schedule & Revision Cap</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {transparencySheet.milestonesSchedule.map((m: any) => (
                <div key={m.sequenceOrder} className="p-3.5 bg-surface-subtle rounded-xl border border-surface-border">
                  <div className="text-[10px] font-mono text-ink-muted font-bold">
                    MILESTONE 0{m.sequenceOrder} ({m.percentOfBudget}%)
                  </div>
                  <div className="text-xs font-bold text-ink-primary mt-0.5">{m.title}</div>
                  <div className="text-base font-bold font-mono text-accent-cobalt mt-1.5">
                    {formatCurrency(
                      Math.floor((membership.payoutMinorUnits * m.percentOfBudget) / 100),
                      project.currency
                    )}
                  </div>
                  <div className="text-[10px] text-ink-muted mt-0.5">Your Milestone Slice</div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
              <span>
                <strong>Revision Cap Policy:</strong> Strictly 2 revision rounds per milestone. Extra client requests trigger a funded Change Order.
              </span>
              <span className="font-mono text-amber-800 font-bold">Cap: 2 Rounds</span>
            </div>
          </div>

          {/* Legal IP Assignment & Non-Circumvention Summary */}
          <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border text-xs text-ink-secondary space-y-1">
            <div className="font-bold text-ink-primary">IP Assignment & Non-Circumvention Summary:</div>
            <p className="leading-relaxed">{transparencySheet.ipAssignmentTerms}</p>
          </div>

          {/* Electronic Signature or Status */}
          <div className="pt-4 border-t border-surface-border">
            {isAccepted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-accent-emerald text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Scope of Work E-Signed & Accepted</span>
                  </div>
                  <div className="text-ink-secondary mt-0.5 font-mono">
                    Signatory: {membership.signedName} • {formatDate(membership.signedAt)} • IP: {membership.signedIp}
                  </div>
                </div>
                <Link
                  to={`/talent/projects/${project.id}`}
                  className="px-4 py-2 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover"
                >
                  Go to Project Workspace
                </Link>
              </div>
            ) : isDeclined ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl text-xs text-gray-700">
                <strong>You declined this project offer.</strong> Reason: "{membership.declineReason}"
              </div>
            ) : (
              <form onSubmit={handleAcceptAndSign} className="space-y-4">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-accent-cobalt uppercase font-mono">
                    <FileText className="w-4 h-4" />
                    <span>Binding Electronic Signature</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1">
                      Type your full legal name to e-sign the Master Scope of Work *
                    </label>
                    <input
                      type="text"
                      required
                      value={signedName}
                      onChange={(e) => setSignedName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-ink-muted">
                    By clicking "Accept & E-Sign SOW", you agree to join this project pod and commit your agreed capacity.
                    Your IP address and timestamp will be cryptographically logged.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeclineModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    Decline Offer
                  </button>

                  <button
                    type="submit"
                    disabled={eSigning}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-sm hover:bg-accent-cobalt-hover shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {eSigning ? 'Recording Signature...' : 'Accept & E-Sign SOW'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Decline Reason Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-surface-border shadow-elevated space-y-4">
              <h3 className="text-lg font-bold text-ink-primary">Decline Project Offer</h3>
              <p className="text-xs text-ink-secondary">
                Please provide a brief reason so our founder ops team can reallocate the pod slot:
              </p>
              <textarea
                required
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Current workload exceeded, timing conflict, or domain mismatch..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeclineModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  disabled={declining || !declineReason.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {declining ? 'Declining...' : 'Confirm Decline'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

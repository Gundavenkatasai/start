import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
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
  Sparkles,
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
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-surface-border text-center space-y-4 shadow-subtle">
          <AlertCircle className="w-8 h-8 text-accent-rose mx-auto" />
          <h2 className="text-xl font-bold font-sans">{error || 'Invitation Not Found'}</h2>
          <Link
            to="/talent/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cobalt hover:underline"
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
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Hero Transparency Card */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-surface-border shadow-smooth space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" dot pulse>
                  OPEN-BOOK SOW OFFER
                </Badge>
                <span className="text-xs font-mono text-ink-muted">
                  Client: {project.client?.companyName} ({project.client?.billingCountry})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary font-sans">
                {project.title}
              </h1>
              <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 max-w-2xl leading-relaxed">
                {project.scopeSummary}
              </p>
            </div>

            <div className="text-left sm:text-right bg-accent-emerald-light/70 p-5 rounded-2xl border border-accent-emerald-border shrink-0">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">
                YOUR GUARANTEED FIXED PAYOUT
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-950 mt-1">
                {formatCurrency(membership.payoutMinorUnits, project.currency)}
              </div>
              <span className="text-[11px] font-mono text-emerald-700 block mt-0.5">
                {membership.sharePercent}% of gross client budget
              </span>
            </div>
          </div>

          {/* Gross Budget & Platform Margin Transparency Sheet */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary mb-3 flex items-center gap-2 font-sans">
              <Scale className="w-4 h-4 text-accent-cobalt" />
              <span>Full Project Budget Transparency Sheet</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-subtle/80 border border-surface-border">
                <div className="text-xs text-ink-secondary font-medium">Gross Client Contract</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-ink-primary mt-1">
                  {formatCurrency(transparencySheet.grossBudgetMinorUnits, project.currency)}
                </div>
                <div className="text-[11px] text-ink-muted mt-1 font-mono">100% of client invoice</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-surface-subtle/80 border border-surface-border">
                <div className="text-xs text-ink-secondary font-medium">
                  Platform & Ops Fee ({transparencySheet.platformMarginPercent}%)
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-ink-primary mt-1">
                  {formatCurrency(transparencySheet.platformBreakdown.totalPlatformMinorUnits, project.currency)}
                </div>
                <div className="text-[11px] text-ink-muted mt-1 font-mono">Sales, founder PM & QA reserve</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-accent-emerald-light/60 border border-accent-emerald-border">
                <div className="text-xs text-emerald-900 font-medium">
                  Total Execution Pod Pool ({transparencySheet.podTotalSharePercent}%)
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-950 mt-1">
                  {formatCurrency(
                    transparencySheet.grossBudgetMinorUnits - transparencySheet.platformBreakdown.totalPlatformMinorUnits,
                    project.currency
                  )}
                </div>
                <div className="text-[11px] text-emerald-800 mt-1 font-mono">Directly allocated to specialists</div>
              </div>
            </div>

            {/* Platform Itemized Sub-split */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-subtle/70 border border-surface-border text-xs">
              <div className="text-ink-primary font-mono font-bold mb-2.5">
                Itemized 30% Platform Breakdown:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-surface-border/80">
                  <span className="text-ink-muted block text-[11px]">Sales & Client Ops (12%):</span>
                  <strong className="font-mono text-ink-primary text-sm mt-0.5 block">
                    {formatCurrency(transparencySheet.platformBreakdown.salesAndOpsMinorUnits, project.currency)}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-surface-border/80">
                  <span className="text-ink-muted block text-[11px]">Founder PM & QA (10%):</span>
                  <strong className="font-mono text-accent-cobalt text-sm mt-0.5 block">
                    {formatCurrency(transparencySheet.platformBreakdown.pmAndQaMinorUnits, project.currency)}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-surface-border/80">
                  <span className="text-ink-muted block text-[11px]">Warranty Reserve (8%):</span>
                  <strong className="font-mono text-emerald-700 text-sm mt-0.5 block">
                    {formatCurrency(transparencySheet.platformBreakdown.reserveMarginMinorUnits, project.currency)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Pod Roles & Effort Weights */}
          <div className="pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary mb-3 flex items-center gap-2 font-sans">
              <Users className="w-4 h-4 text-accent-cobalt" />
              <span>Pod Roles & Assigned Weights</span>
            </h3>

            <div className="space-y-2">
              {transparencySheet.allRoles.map((role: any) => {
                const isYou = role.talentId === membership.talentId;
                return (
                  <div
                    key={role.talentId}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-mono transition-all ${
                      isYou
                        ? 'bg-accent-cobalt-light/70 border-accent-cobalt text-accent-cobalt font-bold shadow-subtle'
                        : 'bg-white border-surface-border text-ink-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-current shrink-0" />
                      <span>{role.roleTitle}</span>
                      {isYou && (
                        <Badge variant="primary" size="sm">
                          YOU
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{role.sharePercent}% Share</span>
                      <span className="font-bold">
                        {formatCurrency(role.payoutMinorUnits, project.currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* E-Signature & Agreement Form */}
          <div className="pt-4 border-t border-surface-border/80">
            {isAccepted ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-accent-emerald-light border border-accent-emerald-border flex items-center gap-3 text-emerald-950 text-xs">
                <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
                <div>
                  <div className="font-bold text-sm font-sans">Scope of Work E-Signed & Accepted</div>
                  <div className="text-[11px] font-mono mt-0.5">
                    Signed by: <strong>{membership.signedName}</strong> on {formatDate(membership.acceptedAt)}
                  </div>
                </div>
              </div>
            ) : isDeclined ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-secondary border border-surface-border text-ink-secondary text-xs">
                You declined this invitation offer.
              </div>
            ) : (
              <form onSubmit={handleAcceptAndSign} className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-subtle/80 border border-surface-border text-xs text-ink-secondary space-y-2 leading-relaxed">
                  <div className="font-bold text-ink-primary font-sans">Master Contractor Terms Confirmation:</div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px]">
                    <li>Guaranteed milestone escrow disbursement upon founder QA + client sign-off.</li>
                    <li>Strict 2-round revision cap per milestone protect against scope creep.</li>
                    <li>12-month mutual non-circumvention binding both client and contractor.</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5 font-sans">
                    Type Full Legal Name to Electronically Sign SOW *
                  </label>
                  <input
                    type="text"
                    required
                    value={signedName}
                    onChange={(e) => setSignedName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none font-mono transition-all shadow-subtle"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeclineModal(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-surface-border text-xs text-ink-secondary hover:text-accent-rose hover:border-rose-300 font-medium transition-colors"
                  >
                    Decline Offer
                  </button>

                  <button
                    type="submit"
                    disabled={eSigning}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {eSigning ? 'Signing Contract...' : 'E-Sign & Accept Pod Position'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-smooth space-y-4">
              <h3 className="text-base font-bold text-ink-primary font-sans">Decline Project Pod Offer</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Please provide a brief reason so founder ops can adjust future matching criteria:
              </p>
              <textarea
                rows={3}
                required
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Schedule conflict, looking for longer commitment, etc."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeclineModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={declining}
                  onClick={handleDecline}
                  className="px-4 py-2 rounded-xl bg-accent-rose text-white text-xs font-semibold hover:bg-accent-rose-hover shadow-sm disabled:opacity-50"
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

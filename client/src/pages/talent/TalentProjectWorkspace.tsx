import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { MilestoneStatusBadge, PayoutStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TalentProjectWorkspace: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deliverable submission state
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkspace = async () => {
    try {
      const res = await api.get(`/talent/projects/${projectId}`);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [projectId]);

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestoneId || !deliverableUrl.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/talent/deliverables', {
        milestoneId: selectedMilestoneId,
        deliverableUrl,
        notes: submissionNotes,
      });

      if (res.success) {
        alert('Deliverable submitted! Founder QA Gate will review before publishing to client.');
        setSelectedMilestoneId(null);
        setDeliverableUrl('');
        setSubmissionNotes('');
        await fetchWorkspace();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit deliverable');
    } finally {
      setSubmitting(false);
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

  if (error || !data) {
    return (
      <PortalLayout>
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-surface-border text-center space-y-4 shadow-subtle">
          <AlertCircle className="w-8 h-8 text-accent-rose mx-auto" />
          <h2 className="text-xl font-bold font-sans">{error || 'Project Not Found'}</h2>
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

  const { project, myMembership } = data;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Workspace Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/talent/dashboard"
              className="text-xs font-mono text-ink-muted hover:text-ink-primary inline-flex items-center gap-1 mb-2.5 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="primary" dot pulse>
                ACTIVE POD WORKSPACE
              </Badge>
              <span className="text-xs font-mono text-ink-muted">
                Role: <strong>{myMembership?.roleTitle}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary font-sans">{project.title}</h1>
          </div>

          <div className="text-left md:text-right bg-accent-emerald-light/60 p-4 sm:p-5 rounded-2xl border border-accent-emerald-border shrink-0">
            <span className="text-[10px] font-mono text-emerald-800 uppercase block font-semibold">
              YOUR FIXED ROLE PAYOUT
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-950 mt-0.5">
              {formatCurrency(myMembership?.payoutMinorUnits, project.currency)}
            </div>
            <span className="text-[11px] font-mono text-emerald-700 block mt-0.5">
              ({myMembership?.sharePercent}% of client budget)
            </span>
          </div>
        </div>

        {/* Milestones & Deliverables Submissions Strip */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-ink-primary font-sans">
                Milestone Deliverables & QA Review Gate
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                Submit links to PRs, Figma files, or video renders. Founders review and approve before client review.
              </p>
            </div>
            <Badge variant="primary">
              {project.milestones?.length || 3} Sprints
            </Badge>
          </div>

          <div className="space-y-4">
            {project.milestones?.map((m: any) => {
              const submission = m.deliverableSubmissions?.[0];
              const isSubmitted = !!submission;

              return (
                <div
                  key={m.id}
                  className="p-5 sm:p-6 rounded-2xl border border-surface-border bg-surface-subtle/70 hover:bg-white hover:border-slate-300 hover:shadow-subtle transition-all duration-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        0{m.sequenceOrder}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-ink-primary font-sans">{m.title}</h4>
                        <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                          {m.deliverablesSummary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <MilestoneStatusBadge status={m.status} />
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-ink-primary">
                          {formatCurrency(m.amountMinorUnits, project.currency)}
                        </div>
                        <span className="text-[10px] font-mono text-ink-muted">{m.percentOfBudget}% Escrow</span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Status or Action */}
                  <div className="p-3.5 bg-white rounded-xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-subtle">
                    <div>
                      {isSubmitted ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                          <span className="font-mono text-ink-primary">
                            Deliverable submitted ({formatDate(submission.createdAt)})
                          </span>
                        </div>
                      ) : (
                        <span className="text-ink-muted font-mono">
                          Deliverable pending submission for founder QA review.
                        </span>
                      )}
                    </div>

                    <div>
                      {m.status === 'IN_PROGRESS' || m.status === 'FUNDED_ESCROW' ? (
                        <button
                          onClick={() => setSelectedMilestoneId(m.id)}
                          className="px-4 py-2 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow flex items-center gap-1.5 transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Deliverable for M{m.sequenceOrder}</span>
                        </button>
                      ) : m.status === 'APPROVED_PAID' ? (
                        <Badge variant="success" dot>
                          Milestone Approved & Released
                        </Badge>
                      ) : (
                        <span className="text-[11px] font-mono text-ink-muted">
                          Status: {m.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Existing Deliverable Preview */}
                  {submission && (
                    <div className="p-4 rounded-xl bg-surface-subtle/80 border border-surface-border text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <a
                          href={submission.deliverableUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-accent-cobalt underline hover:text-accent-cobalt-hover inline-flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{submission.deliverableUrl}</span>
                        </a>
                        <Badge variant="secondary" size="sm">{submission.reviewStatus}</Badge>
                      </div>
                      {submission.notes && (
                        <p className="text-ink-secondary text-[11px] leading-relaxed">
                          Notes: "{submission.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deliverable Submission Modal */}
        {selectedMilestoneId && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-smooth space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-base font-bold text-ink-primary font-sans">
                Submit Deliverable for Founder QA Gate
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Your submission will be tested and reviewed by Alex & Dev before being presented to the client.
              </p>

              <form onSubmit={handleSubmitDeliverable} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    Deliverable URL (GitHub PR / Figma / Video / Cloudflare Link) *
                  </label>
                  <input
                    type="url"
                    required
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    placeholder="https://github.com/my-org/repo/pull/12"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    Release Notes & Testing Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Explain what was implemented, how to run tests, and any key architectural decisions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border/80">
                  <button
                    type="button"
                    onClick={() => setSelectedMilestoneId(null)}
                    className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow disabled:opacity-50 transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Submit to Founder QA'}
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

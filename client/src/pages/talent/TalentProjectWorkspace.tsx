import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { MilestoneStatusBadge, PayoutStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';
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
        <div className="p-8 bg-white rounded-2xl border border-surface-border text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">{error || 'Project not found'}</h2>
          <Link
            to="/talent/dashboard"
            className="text-xs font-mono text-accent-cobalt inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const { project, membership } = data;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Workspace Header */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/talent/dashboard"
              className="text-xs font-mono text-ink-muted hover:text-ink-primary inline-flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-ink-primary">{project.title}</h1>
            <p className="text-xs text-ink-secondary mt-1">
              Client: <strong>{project.client?.companyName}</strong> • Lead Founder PM:{' '}
              <strong>{project.leadAdmin?.fullName || 'Alex Morgan'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border text-right">
              <span className="text-[10px] font-mono text-ink-muted block uppercase">Your Role Payout</span>
              <span className="text-base font-bold font-mono text-accent-emerald">
                {formatCurrency(membership.payoutMinorUnits, project.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Milestones Delivery & QA Status List */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wider font-mono">
              Milestone Checklist & Founder QA Gate
            </h3>
            <span className="text-xs font-mono text-ink-muted">
              Revision Cap: {project.revisionCapPerMilestone} rounds max
            </span>
          </div>

          <div className="space-y-4">
            {project.milestones?.map((m: any) => {
              const myPayout = m.payouts?.[0];
              const latestSubmission = m.deliverableSubmissions?.[0];

              return (
                <div
                  key={m.id}
                  className="p-5 rounded-xl border border-surface-border bg-surface-subtle space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                        {m.sequenceOrder}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-ink-primary">{m.title}</h4>
                        <div className="text-xs text-ink-secondary mt-0.5">
                          {m.deliverablesSummary}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MilestoneStatusBadge status={m.status} />
                      <div className="text-right">
                        <div className="text-xs font-bold font-mono text-ink-primary">
                          {formatCurrency(m.amountMinorUnits, project.currency)}
                        </div>
                        <span className="text-[10px] font-mono text-ink-muted">{m.percentOfBudget}% Budget</span>
                      </div>
                    </div>
                  </div>

                  {/* Payout & QA Status Strip */}
                  <div className="p-3 bg-white rounded-lg border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-muted font-mono">Your Milestone Payout:</span>
                      <strong className="font-mono text-accent-emerald">
                        {myPayout ? formatCurrency(myPayout.netAmountMinorUnits, project.currency) : '—'}
                      </strong>
                      {myPayout && <PayoutStatusBadge status={myPayout.status} />}
                    </div>

                    {/* Action Button: Submit Deliverable */}
                    <div>
                      {m.status === 'IN_PROGRESS' || m.status === 'REVISION_REQUESTED' ? (
                        <button
                          onClick={() => setSelectedMilestoneId(m.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Deliverable for QA</span>
                        </button>
                      ) : m.status === 'IN_QA_REVIEW' ? (
                        <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                          Founder QA Review in Progress
                        </span>
                      ) : m.status === 'APPROVED_PAID' ? (
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved & Signed-Off</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-ink-muted">Upcoming Milestone</span>
                      )}
                    </div>
                  </div>

                  {/* Submission and QA Feedback Block */}
                  {latestSubmission && (
                    <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-accent-cobalt flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <a
                            href={latestSubmission.deliverableUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-blue-800"
                          >
                            Latest Submission Link
                          </a>
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted">
                          QA Status: <strong>{latestSubmission.qaStatus}</strong>
                        </span>
                      </div>
                      {latestSubmission.notes && (
                        <p className="text-ink-secondary text-[11px]">Notes: "{latestSubmission.notes}"</p>
                      )}
                      {latestSubmission.qaFeedback && (
                        <div className="p-2 bg-white rounded border border-blue-100 text-[11px] text-ink-primary">
                          <strong className="text-accent-cobalt">Founder QA Feedback:</strong>{' '}
                          {latestSubmission.qaFeedback}
                        </div>
                      )}
                      {latestSubmission.clientFeedback && (
                        <div className="p-2 bg-purple-50 rounded border border-purple-200 text-[11px] text-purple-900">
                          <strong>Client Feedback:</strong> {latestSubmission.clientFeedback}
                        </div>
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
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-surface-border shadow-elevated space-y-4">
              <h3 className="text-lg font-bold text-ink-primary">Submit Milestone Deliverable</h3>
              <p className="text-xs text-ink-secondary">
                Submit your release URL (GitHub PR/tag, Figma file, preview link). Our 2 founders will QA review
                the deliverable before exposing it to the client.
              </p>

              <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1">
                    Deliverable / Preview URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    placeholder="https://github.com/... or https://figma.com/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1">
                    Release Notes & Testing Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Explain what was built, how to test, and any environment details..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={() => setSelectedMilestoneId(null)}
                    className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !deliverableUrl.trim()}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-accent-cobalt text-white hover:bg-accent-cobalt-hover shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Send to Founder QA Gate'}
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

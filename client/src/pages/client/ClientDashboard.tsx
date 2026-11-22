import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { ProjectStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate, getCategoryLabel } from '../../lib/formatters';
import {
  Briefcase,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get('/client/dashboard');
        if (res.success && res.data) {
          setProjects(res.data.projects);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load client projects');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading client projects...
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Strip */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
              CLIENT PORTAL
            </span>
            <h1 className="text-2xl font-bold text-ink-primary mt-0.5">Project Engagements</h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Fixed-price milestone escrow with founder PM and pre-vetted execution pods.
            </p>
          </div>

          <Link
            to="/client/projects/new"
            className="px-4 py-2.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm flex items-center gap-1.5 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Project Brief</span>
          </Link>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-surface-border text-center space-y-4">
              <Briefcase className="w-10 h-10 text-ink-muted mx-auto" />
              <h3 className="text-base font-bold text-ink-primary">No Active Projects Yet</h3>
              <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                Submit a project brief to have our 2-person founder team scope milestones and assemble a senior pod.
              </p>
              <Link
                to="/client/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-cobalt text-white text-xs font-semibold"
              >
                <span>Submit First Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            projects.map((p) => {
              const activeMilestone = p.milestones?.find((m: any) => m.status !== 'APPROVED_PAID') || p.milestones?.[0];
              const paidMilestones = p.milestones?.filter((m: any) => m.status === 'APPROVED_PAID').length || 0;
              const totalMilestones = p.milestones?.length || 3;
              const progressPercent = Math.round((paidMilestones / totalMilestones) * 100);

              return (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4 hover:border-accent-cobalt transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ProjectStatusBadge status={p.status} />
                        <span className="text-xs font-mono text-ink-muted">
                          {getCategoryLabel(p.category)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-ink-primary">{p.title}</h2>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-ink-muted uppercase block">Fixed Gross Budget</span>
                      <span className="text-xl font-extrabold font-mono text-ink-primary">
                        {formatCurrency(p.grossBudgetMinorUnits, p.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Summary & Lead Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-ink-secondary leading-relaxed line-clamp-2">
                        {p.scopeSummary}
                      </p>
                      {/* Milestone Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted mb-1">
                          <span>Delivery Progress ({paidMilestones}/{totalMilestones} Milestones)</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                          <div
                            className="h-full bg-accent-cobalt rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Assigned Founder Lead Card */}
                    <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-accent-cobalt flex items-center justify-center font-bold font-mono text-xs shrink-0">
                        OP
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-ink-muted block">Founder Project Lead</span>
                        <div className="text-xs font-bold text-ink-primary">
                          {p.leadAdmin?.fullName || 'Alex Morgan'}
                        </div>
                        <div className="text-[10px] text-ink-secondary font-mono">
                          {p.leadAdmin?.email || 'alex@openbench.io'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="pt-2 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-mono text-ink-muted">
                      {activeMilestone ? (
                        <span>
                          Current Focus:{' '}
                          <strong className="text-ink-primary">
                            M{activeMilestone.sequenceOrder} - {activeMilestone.title}
                          </strong>
                        </span>
                      ) : (
                        <span>All deliverables signed-off</span>
                      )}
                    </div>

                    <Link
                      to={`/client/projects/${p.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5 self-start sm:self-center"
                    >
                      <span>Open Project Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

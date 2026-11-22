import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { ProjectStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate, getCategoryLabel } from '../../lib/formatters';
import {
  FolderGit2,
  Sliders,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get('/admin/projects');
        if (res.success && res.data) {
          setProjects(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading project pipeline...
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
              FOUNDER PIPELINE & SCOPING
            </span>
            <h1 className="text-2xl font-bold text-ink-primary mt-0.5">Project Engagements</h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Scope incoming briefs, assemble execution pods with live 100% split validation, and supervise QA sign-offs.
            </p>
          </div>
          <div className="text-xs font-mono text-ink-muted">
            Total Engagements: <strong>{projects.length}</strong>
          </div>
        </div>

        <div className="space-y-4">
          {projects.map((p) => {
            const hasMilestones = p.milestones && p.milestones.length > 0;
            const hasPod = p.podMembers && p.podMembers.length > 0;

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
                    <div className="text-xs text-ink-secondary mt-0.5">
                      Client: <strong>{p.client?.companyName}</strong> ({p.client?.user?.fullName})
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-ink-muted uppercase block">Gross Budget</span>
                    <span className="text-xl font-extrabold font-mono text-ink-primary">
                      {formatCurrency(p.grossBudgetMinorUnits, p.currency)}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted block">
                      Platform Fee: {p.platformFeePercent}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                  {p.scopeSummary}
                </p>

                {/* Pod Members Summary */}
                {hasPod && (
                  <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border text-xs flex flex-wrap items-center gap-3">
                    <span className="font-mono text-ink-muted uppercase text-[10px] font-bold">
                      Assigned Pod ({p.podMembers.length}):
                    </span>
                    {p.podMembers.map((m: any) => (
                      <span
                        key={m.id}
                        className="font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-primary text-[11px] flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-cobalt" />
                        <span>{m.talent?.user?.fullName} ({m.roleTitle} - {m.sharePercent}%)</span>
                        <span className="text-[10px] text-ink-muted">[{m.inviteStatus}]</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Strip */}
                <div className="pt-2 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-mono text-ink-muted flex items-center gap-3">
                    <span>
                      Milestones: <strong>{p.milestones?.length || 0}</strong>
                    </span>
                    <span>•</span>
                    <span>Revision Cap: {p.revisionCapPerMilestone} rounds</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Action 1: Scoping Builder */}
                    <Link
                      to={`/admin/projects/${p.id}/scope`}
                      className="px-3.5 py-1.5 rounded-xl bg-surface-secondary text-ink-primary text-xs font-semibold hover:bg-surface-border border border-surface-border flex items-center gap-1"
                    >
                      <Sliders className="w-3.5 h-3.5 text-accent-cobalt" />
                      <span>{hasMilestones ? 'Re-Scope Milestones' : 'Scope 50/30/20 Project'}</span>
                    </Link>

                    {/* Action 2: Pod Assembler */}
                    <Link
                      to={`/admin/projects/${p.id}/pod`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-accent-cobalt text-xs font-semibold hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{hasPod ? 'Manage Pod' : 'Assemble Pod'}</span>
                    </Link>

                    {/* Action 3: QA Gate & Payouts */}
                    <Link
                      to={`/admin/projects/${p.id}/qa`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
                      <span>QA Gate & Payouts</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
};

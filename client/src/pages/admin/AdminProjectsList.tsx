import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { ProjectStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate, getCategoryLabel } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
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
  ChevronRight,
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" dot pulse>
                FOUNDER PIPELINE & SCOPING
              </Badge>
              <span className="text-xs font-mono text-ink-muted">50/30/20 Escrow Sprints</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary font-sans">Project Engagements</h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Scope incoming briefs, assemble execution pods with live 100% split validation, and supervise QA sign-offs.
            </p>
          </div>
          <Badge variant="secondary">
            Total Engagements: {projects.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {projects.map((p) => {
            const hasMilestones = p.milestones && p.milestones.length > 0;
            const hasPod = p.podMembers && p.podMembers.length > 0;

            return (
              <div
                key={p.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle space-y-4 hover:border-slate-300 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <ProjectStatusBadge status={p.status} />
                      <span className="text-xs font-mono text-ink-muted">
                        {getCategoryLabel(p.category)}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink-primary font-sans">{p.title}</h2>
                    <div className="text-xs text-ink-secondary mt-1">
                      Client: <strong>{p.client?.companyName}</strong> ({p.client?.user?.fullName})
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-ink-muted uppercase block">Gross Budget</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-ink-primary">
                      {formatCurrency(p.grossBudgetMinorUnits, p.currency)}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted block mt-0.5">
                      Platform Fee: {p.platformFeePercent}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                  {p.scopeSummary}
                </p>

                {/* Pod Members Summary */}
                {hasPod && (
                  <div className="p-3.5 bg-surface-subtle/80 rounded-2xl border border-surface-border text-xs flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-ink-muted uppercase text-[10px] font-bold">
                      Assigned Pod ({p.podMembers.length}):
                    </span>
                    {p.podMembers.map((m: any) => (
                      <span
                        key={m.id}
                        className="font-mono px-2.5 py-1 rounded-xl bg-white border border-surface-border text-ink-primary text-[11px] flex items-center gap-1.5 shadow-subtle"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-cobalt" />
                        <span>{m.talent?.user?.fullName} ({m.roleTitle} - {m.sharePercent}%)</span>
                        <span className="text-[10px] text-ink-muted">[{m.inviteStatus}]</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Strip */}
                <div className="pt-3 border-t border-surface-border/80 flex flex-wrap items-center justify-between gap-3">
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
                      className="px-3.5 py-2 rounded-xl bg-surface-subtle hover:bg-surface-secondary text-ink-primary text-xs font-semibold border border-surface-border flex items-center gap-1.5 transition-all shadow-subtle"
                    >
                      <Sliders className="w-3.5 h-3.5 text-accent-cobalt" />
                      <span>{hasMilestones ? 'Re-Scope Milestones' : 'Scope 50/30/20 Project'}</span>
                    </Link>

                    {/* Action 2: Pod Assembler */}
                    <Link
                      to={`/admin/projects/${p.id}/pod`}
                      className="px-3.5 py-2 rounded-xl bg-accent-cobalt-light hover:bg-blue-100/80 text-accent-cobalt text-xs font-semibold border border-accent-cobalt-border flex items-center gap-1.5 transition-all"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{hasPod ? 'Manage Pod' : 'Assemble Pod'}</span>
                    </Link>

                    {/* Action 3: QA Gate & Payouts */}
                    <Link
                      to={`/admin/projects/${p.id}/qa`}
                      className="px-3.5 py-2 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow flex items-center gap-1.5 transition-all"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
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

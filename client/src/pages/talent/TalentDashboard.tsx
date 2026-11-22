import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { TalentProfile, ProjectPodMember, AvailabilityStatus } from '../../types';
import { BenchStatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate, getCategoryLabel } from '../../lib/formatters';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Briefcase,
  DollarSign,
  Calendar,
} from 'lucide-react';

export const TalentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<ProjectPodMember[]>([]);
  const [activeProjects, setActiveProjects] = useState<ProjectPodMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/talent/dashboard');
      if (res.success && res.data) {
        setProfile(res.data.profile);
        setPendingInvitations(res.data.pendingInvitations);
        setActiveProjects(res.data.activeProjects);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load talent dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAvailabilityToggle = async (status: AvailabilityStatus) => {
    setUpdatingAvailability(true);
    try {
      const res = await api.post('/talent/availability', { availabilityStatus: status });
      if (res.success && profile) {
        setProfile({
          ...profile,
          availabilityStatus: status,
          lastAvailabilityConfirmedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update availability');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const getStepProgress = (status: string) => {
    const steps = ['WAITLISTED', 'VETTING', 'ACTIVE_BENCH', 'ON_PROJECT'];
    const currentIndex = steps.indexOf(status);
    return { steps, currentIndex: currentIndex >= 0 ? currentIndex : 0 };
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading bench dashboard...
        </div>
      </PortalLayout>
    );
  }

  if (!profile) {
    return (
      <PortalLayout>
        <div className="p-6 rounded-2xl bg-white border border-surface-border text-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h2 className="text-lg font-bold">Talent Profile Not Found</h2>
        </div>
      </PortalLayout>
    );
  }

  const { steps, currentIndex } = getStepProgress(profile.status);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-surface-border shadow-card">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-ink-muted">BENCH STATUS:</span>
              <BenchStatusBadge status={profile.status} />
            </div>
            <h1 className="text-2xl font-bold text-ink-primary">
              Welcome back, {profile.user?.fullName}
            </h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Vertical: <strong>{getCategoryLabel(profile.primaryCategory)}</strong> • {profile.yearsExperience} yrs exp • {profile.user?.country}
            </p>
          </div>

          {/* Availability Ping Quick Toggle */}
          <div className="bg-surface-subtle p-3.5 rounded-xl border border-surface-border self-start sm:self-center">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent-cobalt" />
                <span>BENCH CAPACITY</span>
              </span>
              <span className="text-[10px] font-mono text-ink-muted">
                Confirmed: {formatDate(profile.lastAvailabilityConfirmedAt)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAvailabilityToggle('AVAILABLE_NOW')}
                disabled={updatingAvailability}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                  profile.availabilityStatus === 'AVAILABLE_NOW'
                    ? 'bg-accent-emerald text-white border-accent-emerald shadow-sm'
                    : 'bg-white text-ink-secondary border-surface-border hover:border-accent-emerald'
                }`}
              >
                Available Now (72h)
              </button>
              <button
                onClick={() => handleAvailabilityToggle('LIMITED')}
                disabled={updatingAvailability}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                  profile.availabilityStatus === 'LIMITED'
                    ? 'bg-accent-cobalt text-white border-accent-cobalt shadow-sm'
                    : 'bg-white text-ink-secondary border-surface-border hover:border-accent-cobalt'
                }`}
              >
                In 2 Weeks
              </button>
              <button
                onClick={() => handleAvailabilityToggle('UNAVAILABLE')}
                disabled={updatingAvailability}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                  profile.availabilityStatus === 'UNAVAILABLE'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                    : 'bg-white text-ink-secondary border-surface-border hover:border-slate-400'
                }`}
              >
                Booked
              </button>
            </div>
          </div>
        </div>

        {/* Bench Progress Stepper */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mb-4">
            Talent Bench Pipeline Progression
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {steps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={step}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 border-accent-cobalt shadow-sm'
                      : isPast
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-surface-subtle border-surface-border opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-mono text-ink-muted mb-1">STAGE 0{idx + 1}</div>
                  <div className={`text-xs font-bold ${isCurrent ? 'text-accent-cobalt' : isPast ? 'text-accent-emerald' : 'text-ink-secondary'}`}>
                    {step.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-ink-muted mt-1">
                    {step === 'WAITLISTED' && 'Portfolio Review'}
                    {step === 'VETTING' && '15-min Founder Call'}
                    {step === 'ACTIVE_BENCH' && '72h Pod Warmth'}
                    {step === 'ON_PROJECT' && 'Pod SOW Active'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Open-Book Pod Invitations Banner */}
        {pendingInvitations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cobalt animate-ping" />
              <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wider font-mono">
                Pending Open-Book Pod Offers ({pendingInvitations.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pendingInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white p-6 rounded-2xl border-2 border-accent-cobalt shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-accent-cobalt border border-blue-200">
                        OPEN-BOOK OFFER
                      </span>
                      <span className="text-xs font-mono text-ink-muted">
                        Client: {inv.project?.client?.companyName}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-ink-primary">{inv.project?.title}</h4>
                    <p className="text-xs text-ink-secondary max-w-xl">
                      Role: <strong className="text-ink-primary">{inv.roleTitle}</strong> ({inv.sharePercent}% of gross budget)
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
                      <div>
                        Total Client Budget:{' '}
                        <span className="font-bold text-ink-primary">
                          {formatCurrency(inv.project?.grossBudgetMinorUnits || 0, inv.project?.currency)}
                        </span>
                      </div>
                      <div>
                        Platform Margin:{' '}
                        <span className="font-bold text-ink-primary">
                          {inv.project?.platformFeePercent}%
                        </span>
                      </div>
                      <div className="text-accent-emerald font-bold text-sm">
                        Your Fixed Payout: {formatCurrency(inv.payoutMinorUnits, inv.project?.currency)}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/talent/invitations/${inv.id}`}
                    className="px-6 py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-xs hover:bg-accent-cobalt-hover shadow-md flex items-center justify-center gap-2 self-start md:self-center shrink-0"
                  >
                    <span>Inspect Transparency Sheet & E-Sign</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Projects Workspace Cards */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wider font-mono">
              Your Active Project Pods
            </h3>
            <span className="text-xs font-mono text-ink-muted">{activeProjects.length} Active</span>
          </div>

          {activeProjects.length === 0 ? (
            <div className="py-10 text-center text-xs text-ink-muted font-mono bg-surface-subtle rounded-xl border border-dashed border-surface-border">
              No active project pods currently running. Ensure your availability status is set to "Available Now".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl border border-surface-border hover:border-accent-cobalt transition-all space-y-3 bg-surface-subtle"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                      {p.roleTitle}
                    </span>
                    <span className="text-xs font-bold font-mono text-accent-emerald">
                      {formatCurrency(p.payoutMinorUnits, p.project?.currency)}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-ink-primary">{p.project?.title}</h4>
                    <p className="text-xs text-ink-secondary mt-1 line-clamp-2">
                      {p.project?.scopeSummary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                    <span className="text-[11px] font-mono text-ink-muted">
                      Milestones: {p.project?.milestones?.length || 3}
                    </span>
                    <Link
                      to={`/talent/projects/${p.projectId}`}
                      className="text-xs font-semibold text-accent-cobalt hover:underline inline-flex items-center gap-1 font-mono"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

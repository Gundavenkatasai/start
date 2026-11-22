import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { formatCurrency, getCategoryLabel } from '../../lib/formatters';
import {
  Users,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Send,
  Scale,
} from 'lucide-react';

export const AdminPodAssembler: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [benchTalent, setBenchTalent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pod Members State
  const [podMembers, setPodMembers] = useState<
    { talentId: string; roleTitle: string; sharePercent: number }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectRes, talentRes] = await Promise.all([
          api.get('/admin/projects'),
          api.get('/admin/talent?status=ACTIVE_BENCH'),
        ]);

        if (projectRes.success && projectRes.data) {
          const found = projectRes.data.find((p: any) => p.id === projectId);
          setProject(found);

          if (found && found.podMembers && found.podMembers.length > 0) {
            setPodMembers(
              found.podMembers.map((m: any) => ({
                talentId: m.talentId,
                roleTitle: m.roleTitle,
                sharePercent: m.sharePercent,
              }))
            );
          } else if (talentRes.data && talentRes.data.length > 0) {
            // Pre-fill with first specialist
            setPodMembers([
              {
                talentId: talentRes.data[0].id,
                roleTitle: 'Principal Lead Engineer',
                sharePercent: 70.0 - (found?.platformFeePercent || 30.0) >= 0 ? 45.0 : 70.0,
              },
            ]);
          }
        }

        if (talentRes.success && talentRes.data) {
          setBenchTalent(talentRes.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load pod assembler');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

  const platformFee = project?.platformFeePercent || 30.0;
  const talentTotalShare = podMembers.reduce((sum, m) => sum + Number(m.sharePercent), 0);
  const totalAllocatedPercent = Math.round((platformFee + talentTotalShare) * 100) / 100;
  const isBalanced = Math.abs(totalAllocatedPercent - 100) < 0.01;

  const handleAddMember = () => {
    if (podMembers.length >= 4) {
      alert('Maximum 4 specialists per execution pod.');
      return;
    }
    const remainingTalent = benchTalent.find(
      (t) => !podMembers.some((m) => m.talentId === t.id)
    );
    if (!remainingTalent && benchTalent.length > 0) {
      alert('All active bench specialists are currently assigned to this pod.');
      return;
    }

    const availablePercent = Math.max(0, 100 - (platformFee + talentTotalShare));

    setPodMembers([
      ...podMembers,
      {
        talentId: remainingTalent ? remainingTalent.id : benchTalent[0]?.id || '',
        roleTitle: 'Senior Specialist',
        sharePercent: Math.round(availablePercent * 10) / 10,
      },
    ]);
  };

  const handleRemoveMember = (idx: number) => {
    setPodMembers(podMembers.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: string, value: any) => {
    const updated = [...podMembers];
    (updated[idx] as any)[field] = value;
    setPodMembers(updated);
  };

  const handleSendPodInvitations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      alert(
        `Total percentage must equal 100%. Platform is ${platformFee}%, specialists sum to ${talentTotalShare}% (Total: ${totalAllocatedPercent}%).`
      );
      return;
    }

    setSaving(true);
    try {
      const res = await api.post(`/admin/projects/${projectId}/pod`, { podMembers });
      if (res.success) {
        alert(
          'Pod assembled! Open-book invitations dispatched with transparency sheet to selected specialists.'
        );
        navigate(`/admin/projects/${projectId}/qa`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to assemble pod');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading pod assembler...
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Pipeline</span>
        </Link>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                OPEN-BOOK POD ASSEMBLER
              </span>
              <h1 className="text-2xl font-bold text-ink-primary mt-1">
                Assemble Pod: {project?.title}
              </h1>
              <p className="text-xs text-ink-secondary mt-0.5">
                Gross Budget: <strong className="font-mono text-ink-primary">{formatCurrency(project?.grossBudgetMinorUnits, project?.currency)}</strong> • Client: {project?.client?.companyName}
              </p>
            </div>

            {/* Live 100% Validator Pill */}
            <div
              className={`p-4 rounded-xl border text-right font-mono self-start sm:self-center ${
                isBalanced
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <span className="text-[10px] font-bold uppercase block tracking-wider">
                100% SPLIT VALIDATOR
              </span>
              <div className="text-xl font-extrabold mt-0.5">
                {totalAllocatedPercent}% / 100.0%
              </div>
              <span className="text-[10px]">
                {isBalanced ? '✓ Perfectly Balanced' : '⚠️ Must sum to exactly 100%'}
              </span>
            </div>
          </div>

          {/* Allocation Breakdown Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border">
              <span className="text-[10px] font-mono text-ink-muted uppercase block font-bold">
                Platform Margin (Fixed by Scoping)
              </span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-1">
                {platformFee}% = {formatCurrency(Math.floor((project?.grossBudgetMinorUnits * platformFee) / 100), project?.currency)}
              </div>
              <span className="text-[11px] text-ink-muted">12% Ops, 10% Founder PM, 8% Reserve</span>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">
                Execution Pod Pool
              </span>
              <div className="text-lg font-bold font-mono text-emerald-950 mt-1">
                {talentTotalShare}% = {formatCurrency(Math.floor((project?.grossBudgetMinorUnits * talentTotalShare) / 100), project?.currency)}
              </div>
              <span className="text-[11px] text-emerald-700">Distributed across specialists below</span>
            </div>
          </div>

          <form onSubmit={handleSendPodInvitations} className="space-y-6 text-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink-primary uppercase tracking-wider font-mono">
                  Select Bench Specialists (1–4 Pod Members)
                </h3>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3 py-1.5 rounded-lg bg-surface-secondary text-ink-primary hover:bg-surface-border text-xs font-semibold flex items-center gap-1 border border-surface-border"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Specialist</span>
                </button>
              </div>

              <div className="space-y-3">
                {podMembers.map((member, idx) => {
                  const calculatedPayout = Math.floor(
                    (project?.grossBudgetMinorUnits * member.sharePercent) / 100
                  );

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-surface-border bg-surface-subtle space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-accent-cobalt text-white font-mono text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold font-mono text-ink-primary">
                            Specialist Slot 0{idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 font-mono text-accent-emerald font-bold">
                            <span>Payout:</span>
                            <span>{formatCurrency(calculatedPayout, project?.currency)}</span>
                          </div>
                          {podMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(idx)}
                              className="text-ink-muted hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Select Specialist */}
                        <div>
                          <label className="block text-[11px] text-ink-muted mb-0.5">Select Bench Talent *</label>
                          <select
                            value={member.talentId}
                            onChange={(e) => handleMemberChange(idx, 'talentId', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
                          >
                            {benchTalent.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.user?.fullName} ({t.user?.country} • {t.primaryCategory})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Role Title */}
                        <div>
                          <label className="block text-[11px] text-ink-muted mb-0.5">Role Title on Project *</label>
                          <input
                            type="text"
                            required
                            value={member.roleTitle}
                            onChange={(e) => handleMemberChange(idx, 'roleTitle', e.target.value)}
                            placeholder="e.g. Lead Full-Stack Engineer"
                            className="w-full px-3 py-1.5 rounded-lg border border-surface-border bg-white focus:border-accent-cobalt outline-none"
                          />
                        </div>

                        {/* Share % */}
                        <div>
                          <label className="block text-[11px] text-ink-muted mb-0.5">Gross Share % *</label>
                          <input
                            type="number"
                            step="0.5"
                            required
                            value={member.sharePercent}
                            onChange={(e) =>
                              handleMemberChange(idx, 'sharePercent', Number(e.target.value))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <span className="text-xs font-mono text-ink-muted">
                Dispatches SOW offers with full open-book transparency sheets.
              </span>

              <button
                type="submit"
                disabled={saving || !isBalanced}
                className="px-6 py-2.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs hover:bg-accent-cobalt-hover shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{saving ? 'Dispatching...' : 'Send Open-Book Pod Invitations'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

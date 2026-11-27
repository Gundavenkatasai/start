import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { Currency } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, ArrowRight, Sliders, CheckCircle2, AlertCircle, Plus, Trash2, Sparkles } from 'lucide-react';

export const AdminProjectScoping: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [currency, setCurrency] = useState<Currency>('USD');
  const [grossBudget, setGrossBudget] = useState(10000); // major units
  const [platformFeePercent, setPlatformFeePercent] = useState(30.0);
  const [revisionCap, setRevisionCap] = useState(2);

  const [milestones, setMilestones] = useState([
    {
      sequenceOrder: 1,
      title: 'Architecture Blueprint, UI Design System & Tech Specs',
      deliverablesSummary: 'Complete Figma components, OpenAPI contracts, and Docker boilerplate.',
      percentOfBudget: 50.0,
    },
    {
      sequenceOrder: 2,
      title: 'Core Implementation, API Integrations & Functional Review',
      deliverablesSummary: 'Working frontend and backend integration ready for Founder QA review.',
      percentOfBudget: 30.0,
    },
    {
      sequenceOrder: 3,
      title: 'Testing Hardening, Production Deployment & Source Transfer',
      deliverablesSummary: 'End-to-end verification, production hosting deploy, and legal IP handover.',
      percentOfBudget: 20.0,
    },
  ]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get('/admin/projects');
        if (res.success && res.data) {
          const found = res.data.find((p: any) => p.id === projectId);
          if (found) {
            setProject(found);
            setCurrency(found.currency || 'USD');
            setGrossBudget((found.grossBudgetMinorUnits || 1000000) / 100);
            setPlatformFeePercent(found.platformFeePercent || 30.0);
            setRevisionCap(found.revisionCapPerMilestone || 2);
            if (found.milestones && found.milestones.length > 0) {
              setMilestones(
                found.milestones.map((m: any) => ({
                  sequenceOrder: m.sequenceOrder,
                  title: m.title,
                  deliverablesSummary: m.deliverablesSummary,
                  percentOfBudget: m.percentOfBudget,
                }))
              );
            }
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  const totalMilestonePercent = milestones.reduce((sum, m) => sum + Number(m.percentOfBudget), 0);
  const isMilestoneValid = Math.abs(totalMilestonePercent - 100) < 0.01;

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    const updated = [...milestones];
    (updated[index] as any)[field] = value;
    setMilestones(updated);
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        sequenceOrder: milestones.length + 1,
        title: `Sprint Phase ${milestones.length + 1}`,
        deliverablesSummary: 'Deliverable description...',
        percentOfBudget: 10.0,
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    const updated = milestones
      .filter((_, i) => i !== index)
      .map((m, i) => ({ ...m, sequenceOrder: i + 1 }));
    setMilestones(updated);
  };

  const handleSaveScoping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMilestoneValid) {
      alert(`Milestone percentages must sum to 100%. Current sum: ${totalMilestonePercent}%`);
      return;
    }

    setSaving(true);
    try {
      const res = await api.post(`/admin/projects/${projectId}/scope`, {
        currency,
        grossBudgetMinorUnits: Math.round(grossBudget * 100),
        platformFeePercent: Number(platformFeePercent),
        revisionCapPerMilestone: Number(revisionCap),
        milestones,
      });

      if (res.success) {
        alert('Project scoped! Now proceed to assemble the pod specialists.');
        navigate(`/admin/projects/${projectId}/pod`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save project scoping');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading scoping builder...
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Pipeline</span>
        </Link>

        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-surface-border shadow-smooth space-y-6">
          <div className="border-b border-surface-border/80 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" dot pulse>
                SCOPING & 50/30/20 BUILDER
              </Badge>
              <span className="text-xs font-mono text-ink-muted">Milestone Allocation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary font-sans">
              Scope Project: {project?.title}
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Client: <strong>{project?.client?.companyName}</strong> • Target Timeline:{' '}
              {project?.targetTimeline || '4-6 weeks'}
            </p>
          </div>

          <form onSubmit={handleSaveScoping} className="space-y-6 text-xs">
            {/* Top Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">Billing Currency *</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono transition-all shadow-subtle"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">Gross Client Budget ({currency}) *</label>
                <input
                  type="number"
                  required
                  value={grossBudget}
                  onChange={(e) => setGrossBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 font-mono rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">Platform Share % (Default 30%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 font-mono rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">Revision Cap / Milestone</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={revisionCap}
                  onChange={(e) => setRevisionCap(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 font-mono rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
                />
              </div>
            </div>

            {/* Milestones Schedule Builder */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-surface-border/80 pb-3">
                <div>
                  <h3 className="font-bold text-ink-primary uppercase tracking-wider font-mono">
                    Milestone Delivery & Escrow Schedule
                  </h3>
                  <div className="text-[11px] font-mono text-ink-muted mt-0.5">
                    Total Percent:{' '}
                    <strong className={isMilestoneValid ? 'text-accent-emerald font-bold' : 'text-accent-rose font-bold'}>
                      {totalMilestonePercent}% / 100%
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface-secondary text-ink-primary text-xs font-semibold flex items-center gap-1.5 border border-surface-border transition-all shadow-subtle"
                >
                  <Plus className="w-3.5 h-3.5 text-accent-cobalt" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => {
                  const calculatedAmount = Math.floor((grossBudget * m.percentOfBudget) / 100);
                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl border border-surface-border bg-surface-subtle/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            0{m.sequenceOrder}
                          </span>
                          <input
                            type="text"
                            required
                            value={m.title}
                            onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                            placeholder="Milestone title..."
                            className="flex-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              required
                              min="5"
                              max="90"
                              step="5"
                              value={m.percentOfBudget}
                              onChange={(e) =>
                                handleMilestoneChange(idx, 'percentOfBudget', Number(e.target.value))
                              }
                              className="w-16 px-2 py-1.5 text-xs font-mono rounded-xl border border-surface-border bg-white text-right focus:border-accent-cobalt outline-none"
                            />
                            <span className="text-xs font-mono text-ink-muted">%</span>
                          </div>
                          <span className="font-mono font-bold text-accent-cobalt text-xs">
                            ≈ {formatCurrency(calculatedAmount * 100, currency)}
                          </span>
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMilestone(idx)}
                              className="p-1.5 rounded-xl text-ink-muted hover:text-accent-rose hover:bg-accent-rose-light/40 transition-colors ml-1"
                              title="Delete milestone"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        required
                        value={m.deliverablesSummary}
                        onChange={(e) =>
                          handleMilestoneChange(idx, 'deliverablesSummary', e.target.value)
                        }
                        placeholder="Key deliverables and acceptance criteria for this milestone..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle text-ink-secondary"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border/80 flex items-center justify-between">
              <span className="text-xs font-mono text-ink-muted">
                Step 1 of 2: Scoping → Step 2: Pod Assembly
              </span>
              <button
                type="submit"
                disabled={saving || !isMilestoneValid}
                className="px-6 py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving Scoping...' : 'Confirm Scoping & Assemble Pod'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

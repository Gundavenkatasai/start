import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { Currency } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { ArrowLeft, ArrowRight, Sliders, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

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
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Pipeline</span>
        </Link>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card space-y-6">
          <div className="border-b border-surface-border pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
              SCOPING & 50/30/20 BUILDER
            </span>
            <h1 className="text-2xl font-bold text-ink-primary mt-1">
              Scope Project: {project?.title}
            </h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Client: <strong>{project?.client?.companyName}</strong> • Target Timeline:{' '}
              {project?.targetTimeline || '4-6 weeks'}
            </p>
          </div>

          <form onSubmit={handleSaveScoping} className="space-y-6 text-xs">
            {/* Top Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-ink-primary mb-1">Billing Currency *</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1">Gross Client Budget ({currency}) *</label>
                <input
                  type="number"
                  required
                  value={grossBudget}
                  onChange={(e) => setGrossBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 font-mono rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1">Platform Share % (Default 30%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 font-mono rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1">Revision Cap / Milestone</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={revisionCap}
                  onChange={(e) => setRevisionCap(Number(e.target.value))}
                  className="w-full px-3 py-2 font-mono rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>
            </div>

            {/* Milestones Schedule Builder */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-ink-primary uppercase tracking-wider font-mono">
                    Milestone Delivery & Escrow Schedule
                  </h3>
                  <div className="text-[11px] font-mono text-ink-muted">
                    Total Percent:{' '}
                    <strong className={isMilestoneValid ? 'text-accent-emerald' : 'text-rose-600'}>
                      {totalMilestonePercent}% / 100%
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-1.5 rounded-lg bg-surface-secondary text-ink-primary hover:bg-surface-border text-xs font-semibold flex items-center gap-1 border border-surface-border"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => {
                  const calculatedAmount = Math.floor((grossBudget * m.percentOfBudget) / 100);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-surface-border bg-surface-subtle space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono font-bold text-ink-primary">
                          Milestone 0{m.sequenceOrder}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 font-mono">
                            <input
                              type="number"
                              step="0.5"
                              value={m.percentOfBudget}
                              onChange={(e) =>
                                handleMilestoneChange(idx, 'percentOfBudget', Number(e.target.value))
                              }
                              className="w-16 px-2 py-1 rounded border border-surface-border bg-white text-right font-mono"
                            />
                            <span>% = {formatCurrency(calculatedAmount * 100, currency)}</span>
                          </div>
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMilestone(idx)}
                              className="text-ink-muted hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-ink-muted mb-0.5">Milestone Title</label>
                          <input
                            type="text"
                            required
                            value={m.title}
                            onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-surface-border bg-white focus:border-accent-cobalt outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-ink-muted mb-0.5">Deliverables Summary</label>
                          <input
                            type="text"
                            required
                            value={m.deliverablesSummary}
                            onChange={(e) =>
                              handleMilestoneChange(idx, 'deliverablesSummary', e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-surface-border bg-white focus:border-accent-cobalt outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit & Next Step */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <span className="text-xs font-mono text-ink-muted">
                Next: Select bench talent and allocate pod role shares.
              </span>

              <button
                type="submit"
                disabled={saving || !isMilestoneValid}
                className="px-6 py-2.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs hover:bg-accent-cobalt-hover shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{saving ? 'Saving...' : 'Save & Assemble Pod'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

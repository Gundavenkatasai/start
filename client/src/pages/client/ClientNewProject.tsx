import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { SkillCategory, Currency } from '../../types';
import { ArrowLeft, ArrowRight, AlertCircle, PlusCircle } from 'lucide-react';

export const ClientNewProject: React.FC = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<SkillCategory>('WEB_APP_DEV');
  const [billingCurrency, setBillingCurrency] = useState<Currency>('USD');
  const [title, setTitle] = useState('');
  const [scopeSummary, setScopeSummary] = useState('');
  const [targetBudget, setTargetBudget] = useState(12000);
  const [targetTimeline, setTargetTimeline] = useState('4-6 Weeks');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/client/briefs', {
        title,
        category,
        scopeSummary,
        targetTimeline,
        targetBudgetMinorUnits: targetBudget * 100,
        billingCurrency,
        referenceLinks: referenceUrl ? [referenceUrl] : [],
      });

      if (res.success && res.data) {
        navigate(`/client/projects/${res.data.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit brief');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/client/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
              NEW ENGAGEMENT BRIEF
            </span>
            <h1 className="text-2xl font-bold text-ink-primary mt-1">Submit Project Requirements</h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Two founders will personally scope the milestones, calibrate the 70/30 pod split, and reply within 24 hours.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-ink-primary mb-1">Service Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none"
                >
                  <option value="WEB_APP_DEV">Web & App Development</option>
                  <option value="UI_UX_DESIGN">UI/UX Product Design</option>
                  <option value="VIDEO_EDITING">Video & Motion Editing</option>
                  <option value="DIGITAL_MARKETING">Digital Growth Marketing</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-ink-primary mb-1">Billing Currency *</label>
                <select
                  value={billingCurrency}
                  onChange={(e) => setBillingCurrency(e.target.value as Currency)}
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
                >
                  <option value="USD">USD ($) — Stripe</option>
                  <option value="GBP">GBP (£) — Stripe</option>
                  <option value="EUR">EUR (€) — Stripe</option>
                  <option value="INR">INR (₹) — Razorpay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink-primary mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Workflow Automation Engine & UI"
                className="w-full px-3.5 py-2 rounded-xl border border-surface-border focus:border-accent-cobalt outline-none text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink-primary mb-1">Scope & Key Deliverables *</label>
              <textarea
                required
                rows={4}
                value={scopeSummary}
                onChange={(e) => setScopeSummary(e.target.value)}
                placeholder="Describe project objectives, key features, expected deliverables..."
                className="w-full px-3.5 py-2 rounded-xl border border-surface-border focus:border-accent-cobalt outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-ink-primary mb-1">
                  Target Budget ({billingCurrency}) *
                </label>
                <input
                  type="number"
                  required
                  min={billingCurrency === 'INR' ? 100000 : 2500}
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2 font-mono rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-ink-primary mb-1">Target Timeline</label>
                <input
                  type="text"
                  value={targetTimeline}
                  onChange={(e) => setTargetTimeline(e.target.value)}
                  placeholder="e.g. 4-6 Weeks"
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink-primary mb-1">Figma / GitHub / Reference URL</label>
              <input
                type="url"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
              />
            </div>

            <div className="pt-2 border-t border-surface-border flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs hover:bg-accent-cobalt-hover shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{loading ? 'Submitting...' : 'Submit Brief for Founder Scoping'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

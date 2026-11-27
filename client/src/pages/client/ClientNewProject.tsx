import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { SkillCategory, Currency } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, ArrowRight, AlertCircle, PlusCircle, Sparkles } from 'lucide-react';

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
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-surface-border shadow-smooth space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" dot pulse>
                NEW ENGAGEMENT BRIEF
              </Badge>
              <span className="text-xs font-mono text-ink-muted">24h Founder Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary font-sans">Submit Project Requirements</h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1 leading-relaxed">
              Two founders will personally scope the milestones, calibrate the 70/30 pod split, and reply within 24 hours.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-accent-rose-light border border-accent-rose-border text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent-rose shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">Service Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-sans"
                >
                  <option value="WEB_APP_DEV">Web & App Development</option>
                  <option value="UI_UX_DESIGN">UI/UX Product Design</option>
                  <option value="VIDEO_EDITING">Video & Motion Editing</option>
                  <option value="DIGITAL_MARKETING">Digital Growth Marketing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">Billing Currency *</label>
                <select
                  value={billingCurrency}
                  onChange={(e) => setBillingCurrency(e.target.value as Currency)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-mono"
                >
                  <option value="USD">USD ($) — Stripe</option>
                  <option value="GBP">GBP (£) — Stripe</option>
                  <option value="EUR">EUR (€) — Stripe</option>
                  <option value="INR">INR (₹) — Razorpay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink-primary mb-1.5">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NextGen B2B Analytics Dashboard"
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink-primary mb-1.5">Detailed Scope & Requirements *</label>
              <textarea
                required
                rows={4}
                value={scopeSummary}
                onChange={(e) => setScopeSummary(e.target.value)}
                placeholder="Outline the core deliverables, milestones, tech requirements, and target outcomes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none leading-relaxed transition-all shadow-subtle"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">
                  Target Budget ({billingCurrency}) *
                </label>
                <input
                  type="number"
                  required
                  min={billingCurrency === 'INR' ? 100000 : 2500}
                  step={billingCurrency === 'INR' ? 25000 : 500}
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none font-mono transition-all shadow-subtle"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1.5">Target Timeline</label>
                <input
                  type="text"
                  value={targetTimeline}
                  onChange={(e) => setTargetTimeline(e.target.value)}
                  placeholder="e.g. 4-6 Weeks"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink-primary mb-1.5">Reference Links (Optional)</label>
              <input
                type="url"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="https://figma.com/... or PRD document link"
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
              />
            </div>

            <div className="pt-3 border-t border-surface-border/80">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting Brief...' : 'Submit Brief for Founder Scoping'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

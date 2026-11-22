import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { SkillCategory, Currency } from '../../types';
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StartProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [contactName, setContactName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('Password123!');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [billingCurrency, setBillingCurrency] = useState<Currency>('USD');
  const [category, setCategory] = useState<SkillCategory>('WEB_APP_DEV');
  const [title, setTitle] = useState('');
  const [scopeSummary, setScopeSummary] = useState('');
  const [targetBudget, setTargetBudget] = useState(10000); // major units
  const [targetTimeline, setTargetTimeline] = useState('4-6 Weeks');
  const [referenceUrl, setReferenceUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. If not logged in as CLIENT, register or log in first
      if (!user || user.role !== 'CLIENT') {
        const clientRes = await api.post('/auth/register/client', {
          fullName: contactName,
          email,
          password,
          companyName,
          country,
          billingCurrency,
        });
        if (clientRes.success && clientRes.data) {
          localStorage.setItem('openbench_token', clientRes.data.accessToken);
        }
      }

      // 2. Submit the brief
      const budgetMinorUnits = targetBudget * 100;
      const refLinks = referenceUrl ? [referenceUrl] : [];

      const briefRes = await api.post('/client/briefs', {
        title,
        category,
        scopeSummary,
        targetTimeline,
        targetBudgetMinorUnits: budgetMinorUnits,
        billingCurrency,
        referenceLinks: refLinks,
      });

      if (briefRes.success) {
        navigate('/client/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit brief. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
              CLIENT PROJECT INTAKE
            </span>
            <h1 className="text-3xl font-extrabold text-ink-primary">
              Submit a Project Brief
            </h1>
            <p className="text-sm text-ink-secondary max-w-lg mx-auto">
              Our 2-person founder ops team will review your brief, scope the 50/30/20 milestone schedule, and assemble a vetted pod within 24–48 hours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-surface-border shadow-card p-6 md:p-8 space-y-6"
          >
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Client & Organization Details */}
            {(!user || user.role !== 'CLIENT') && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted border-b border-surface-border pb-2">
                  1. Company & Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1">Company / Startup Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. ApexScale Technologies"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah@apexscale.com"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States, UK, India"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Project Scope & Specs */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted border-b border-surface-border pb-2">
                2. Project Scope & Deliverables
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1">Service Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SkillCategory)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none"
                  >
                    <option value="WEB_APP_DEV">Web & App Development</option>
                    <option value="UI_UX_DESIGN">UI/UX Product Design</option>
                    <option value="VIDEO_EDITING">Video & Motion Editing</option>
                    <option value="DIGITAL_MARKETING">Digital Growth Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1">Billing Currency *</label>
                  <select
                    value={billingCurrency}
                    onChange={(e) => setBillingCurrency(e.target.value as Currency)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
                  >
                    <option value="USD">USD ($) — Stripe</option>
                    <option value="GBP">GBP (£) — Stripe</option>
                    <option value="EUR">EUR (€) — Stripe</option>
                    <option value="INR">INR (₹) — Razorpay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cross-Border Settlement Web App & Admin Dashboard"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1">Detailed Scope & Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={scopeSummary}
                  onChange={(e) => setScopeSummary(e.target.value)}
                  placeholder="Describe the key goals, required features, technical stack, or deliverables needed..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1">
                    Target Budget ({billingCurrency}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={billingCurrency === 'INR' ? 100000 : 2500}
                    step={billingCurrency === 'INR' ? 25000 : 500}
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                  <span className="text-[11px] text-ink-muted">
                    70% goes to the execution pod, 30% to founder PM & QA.
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1">Target Timeline</label>
                  <input
                    type="text"
                    value={targetTimeline}
                    onChange={(e) => setTargetTimeline(e.target.value)}
                    placeholder="e.g. 4-6 Weeks"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1">
                  Reference Links / Figma / Specs (Optional)
                </label>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://figma.com/file/... or https://github.com/..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-surface-border">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-sm hover:bg-accent-cobalt-hover shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting Brief...' : 'Submit Brief for Founder Scoping (Status: DRAFT_BRIEF)'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

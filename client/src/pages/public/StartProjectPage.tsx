import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { SkillCategory, Currency } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-2">
            <Badge variant="primary" dot pulse>
              CLIENT PROJECT INTAKE
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary font-sans tracking-tight">
              Submit a Project Brief
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-lg mx-auto leading-relaxed">
              Our 2-person founder ops team will review your brief, scope the 50/30/20 milestone schedule, and assemble a vetted pod within 24–48 hours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-surface-border shadow-smooth p-6 sm:p-8 md:p-10 space-y-8"
          >
            {error && (
              <div className="p-4 rounded-2xl bg-accent-rose-light border border-accent-rose-border flex items-start gap-3 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-accent-rose shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Client & Organization Details */}
            {(!user || user.role !== 'CLIENT') && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
                  <Badge variant="primary" size="sm">01</Badge>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary">
                    Company & Contact Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">Company / Startup Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. ApexScale Technologies"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah@apexscale.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">Country *</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States, UK, India"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Project Scope & Specs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
                <Badge variant="primary" size="sm">02</Badge>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary">
                  Project Scope & Deliverables
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Service Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SkillCategory)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-sans"
                  >
                    <option value="WEB_APP_DEV">Web & App Development</option>
                    <option value="UI_UX_DESIGN">UI/UX Product Design</option>
                    <option value="VIDEO_EDITING">Video & Motion Editing</option>
                    <option value="DIGITAL_MARKETING">Digital Growth Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Billing Currency *</label>
                  <select
                    value={billingCurrency}
                    onChange={(e) => setBillingCurrency(e.target.value as Currency)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-mono"
                  >
                    <option value="USD">USD ($) — Stripe</option>
                    <option value="GBP">GBP (£) — Stripe</option>
                    <option value="EUR">EUR (€) — Stripe</option>
                    <option value="INR">INR (₹) — Razorpay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cross-Border Settlement Web App & Admin Dashboard"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">Detailed Scope & Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={scopeSummary}
                  onChange={(e) => setScopeSummary(e.target.value)}
                  placeholder="Describe key goals, core features, preferred tech stack, and deliverable targets..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none leading-relaxed transition-all shadow-subtle"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                    Target Budget ({billingCurrency}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={billingCurrency === 'INR' ? 100000 : 2500}
                    step={billingCurrency === 'INR' ? 25000 : 500}
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                  />
                  <span className="text-[11px] font-mono text-ink-muted mt-1 block">
                    70% to execution pod, 30% to founder PM & QA escrow.
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Target Timeline</label>
                  <input
                    type="text"
                    value={targetTimeline}
                    onChange={(e) => setTargetTimeline(e.target.value)}
                    placeholder="e.g. 4-6 Weeks"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  Reference Links / Figma / Specs (Optional)
                </label>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://figma.com/file/... or https://github.com/..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 border-t border-surface-border/80">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

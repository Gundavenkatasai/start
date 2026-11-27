import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { SkillCategory, Currency } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, Plus, X, Sparkles } from 'lucide-react';

export const JoinWaitlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [country, setCountry] = useState('United States');
  const [timezone, setTimezone] = useState('America/New_York');
  const [primaryCategory, setPrimaryCategory] = useState<SkillCategory>('WEB_APP_DEV');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React 19', 'TypeScript', 'Tailwind CSS']);
  const [portfolioUrl1, setPortfolioUrl1] = useState('https://github.com/my-profile');
  const [portfolioUrl2, setPortfolioUrl2] = useState('https://portfolio.dev');
  const [yearsExperience, setYearsExperience] = useState(5);
  const [weeklyHours, setWeeklyHours] = useState(30);
  const [preferredCurrency, setPreferredCurrency] = useState<Currency>('USD');
  const [minimumProjectSize, setMinimumProjectSize] = useState(2500);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError('You must accept the Master Contractor & Non-Circumvention Terms to join the bench.');
      return;
    }

    const portfolioUrls = [portfolioUrl1, portfolioUrl2].filter((url) => url.trim().length > 0);
    if (portfolioUrls.length === 0) {
      setError('Please provide at least one verified portfolio, GitHub, or live case study link.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register/talent', {
        fullName,
        email,
        password,
        country,
        timezone,
        primaryCategory,
        skills,
        portfolioUrls,
        yearsExperience: Number(yearsExperience),
        weeklyHours: Number(weeklyHours),
        preferredCurrency,
        minimumProjectSize: Number(minimumProjectSize),
        acceptedTerms: true,
      });

      if (res.success && res.data) {
        localStorage.setItem('openbench_token', res.data.accessToken);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 py-20">
          <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-surface-border shadow-smooth text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-accent-emerald-light text-accent-emerald border border-accent-emerald-border flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-ink-primary font-sans">Application Received!</h2>
            <Badge variant="warning" dot>
              STATUS: WAITLISTED
            </Badge>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Welcome to the OpenBench collective, <strong className="text-ink-primary">{fullName}</strong>.
              Our 2-person founder team (Alex & Dev) will review your portfolio within 48 hours for 15-minute vetting call scheduling.
            </p>
            <div className="pt-2">
              <Link
                to="/talent/dashboard"
                className="w-full py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow flex items-center justify-center gap-2 transition-all"
              >
                <span>Go to Talent Bench Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-2">
            <Badge variant="primary" dot pulse>
              TALENT BENCH INTAKE
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary font-sans tracking-tight">
              Join the Vetted Talent Bench
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-lg mx-auto leading-relaxed">
              Not an open marketplace race to the bottom. Get matched into fixed-scope project pods with transparent 70% payouts.
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

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
                <Badge variant="primary" size="sm">01</Badge>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary">
                  Personal & Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. marcus@gmail.com"
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
                    placeholder="e.g. United States, UK, Germany, India"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Timezone *</label>
                  <input
                    type="text"
                    required
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="e.g. America/New_York, Asia/Kolkata"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                  />
                </div>
              </div>
            </div>

            {/* Specialization & Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
                <Badge variant="primary" size="sm">02</Badge>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary">
                  Primary Category & Specific Skills
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Primary Skill Vertical *</label>
                  <select
                    value={primaryCategory}
                    onChange={(e) => setPrimaryCategory(e.target.value as SkillCategory)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-sans"
                  >
                    <option value="WEB_APP_DEV">Web & App Development</option>
                    <option value="UI_UX_DESIGN">UI/UX Product Design</option>
                    <option value="VIDEO_EDITING">Video & Motion Editing</option>
                    <option value="DIGITAL_MARKETING">Digital Growth Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Years of Senior Experience *</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-mono"
                  />
                </div>
              </div>

              {/* Skills Tags input */}
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">Key Skills & Tools Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. Next.js, Figma, Premiere Pro, PostgreSQL"
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-surface-subtle hover:bg-surface-secondary text-ink-primary rounded-xl text-xs font-semibold border border-surface-border flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono bg-accent-cobalt-light/70 text-accent-cobalt border border-accent-cobalt-border"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-accent-cobalt/70 hover:text-accent-rose transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proof of Work & Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
                <Badge variant="primary" size="sm">03</Badge>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary">
                  Verified Proof of Work (Up to 3 Links)
                </h3>
              </div>
              <div className="space-y-2.5">
                <input
                  type="url"
                  required
                  value={portfolioUrl1}
                  onChange={(e) => setPortfolioUrl1(e.target.value)}
                  placeholder="Primary Portfolio / GitHub / Dribbble URL *"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                />
                <input
                  type="url"
                  value={portfolioUrl2}
                  onChange={(e) => setPortfolioUrl2(e.target.value)}
                  placeholder="Secondary Link / Case Study / Live App"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                />
              </div>
            </div>

            {/* Availability & Preferred Rates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
                <Badge variant="primary" size="sm">04</Badge>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary">
                  Availability & Budget Preferences
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Weekly Available Hours</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Preferred Currency</label>
                  <select
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value as Currency)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Min Project Size ({preferredCurrency})</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={minimumProjectSize}
                    onChange={(e) => setMinimumProjectSize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Master Contractor Terms Acceptance */}
            <div className="pt-2 border-t border-surface-border/80">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-accent-cobalt focus:ring-accent-cobalt border-surface-border"
                />
                <span className="text-xs text-ink-secondary leading-relaxed">
                  I accept the <strong className="text-ink-primary">Master Contractor & Open-Book Terms</strong>:
                  70% execution pod split, 50/30/20 milestone release schedule, 12-month mutual non-circumvention,
                  and 2-round revision cap per milestone.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Submit Bench Application (Status: WAITLISTED)'}
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

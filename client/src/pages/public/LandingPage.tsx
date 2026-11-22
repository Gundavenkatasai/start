import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BudgetCalculator } from '../../components/shared/BudgetCalculator';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Code2,
  Palette,
  Film,
  Megaphone,
  CheckCircle2,
  Clock,
  DollarSign,
  ChevronRight,
  Sparkles,
  Award,
  Globe2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Answer-First Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-surface-border bg-gradient-to-b from-surface-subtle via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-accent-cobalt border border-blue-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent-cobalt animate-pulse" />
                <span>Operating across US, UK, Europe & India</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink-primary tracking-tight leading-[1.15]">
                Transparent Managed <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-accent-cobalt to-indigo-600 bg-clip-text text-transparent">
                  Talent Collective
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed max-w-2xl mx-auto">
                Not a passive waitlist or opaque agency markup. We match senior freelance pods on an{' '}
                <strong className="text-ink-primary font-semibold">open-book 70/30 split</strong> with
                founder-managed QA review and guaranteed milestone escrow.
              </p>

              {/* Dual CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/start-project"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-sm hover:bg-accent-cobalt-hover shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/join"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-surface-secondary text-ink-primary font-semibold text-sm hover:bg-surface-border border border-surface-border transition-all flex items-center justify-center"
                >
                  Join the Talent Bench
                </Link>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-surface-border">
                <div className="text-center p-3">
                  <div className="text-2xl font-bold font-mono text-ink-primary">&lt; 72 Hours</div>
                  <div className="text-xs text-ink-secondary mt-0.5">Bench Warmth Kickoff</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl font-bold font-mono text-accent-emerald">70 / 30</div>
                  <div className="text-xs text-ink-secondary mt-0.5">Open-Book Budget Split</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl font-bold font-mono text-ink-primary">50/30/20</div>
                  <div className="text-xs text-ink-secondary mt-0.5">Milestone Escrow</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl font-bold font-mono text-accent-cobalt">2 Founders</div>
                  <div className="text-xs text-ink-secondary mt-0.5">Direct QA & Delivery Sign-off</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Launch Skill Verticals */}
        <section id="verticals" className="py-20 bg-white border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                LAUNCH CAPABILITIES
              </span>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight">
                4 Core Engineering & Creative Verticals
              </h2>
              <p className="text-sm text-ink-secondary">
                Pre-vetted specialists working in synchronized pods rather than isolated solo gigs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Vertical 1: Web & App Dev */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-accent-cobalt flex items-center justify-center mb-5 group-hover:bg-accent-cobalt group-hover:text-white transition-colors">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ink-primary mb-2">Web & App Development</h3>
                <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                  Full-stack React 19, Next.js, Node.js, TypeScript, PostgreSQL, and React Native mobile apps.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-border">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    React 19
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    TypeScript
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    Node.js
                  </span>
                </div>
              </div>

              {/* Vertical 2: UI/UX Design */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt transition-all group">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ink-primary mb-2">UI/UX Product Design</h3>
                <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                  Enterprise design systems, interactive prototypes, user journeys, and component architecture in Figma.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-border">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    Figma
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    Design Systems
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    UX Research
                  </span>
                </div>
              </div>

              {/* Vertical 3: Video Editing */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt transition-all group">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ink-primary mb-2">Video & Motion Editing</h3>
                <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                  High-converting SaaS product demos, motion graphics, investor launch videos, and social shorts.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-border">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    Premiere Pro
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    After Effects
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    DaVinci
                  </span>
                </div>
              </div>

              {/* Vertical 4: Digital Marketing */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-accent-emerald flex items-center justify-center mb-5 group-hover:bg-accent-emerald group-hover:text-white transition-colors">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ink-primary mb-2">Digital Growth Marketing</h3>
                <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                  Technical B2B SEO, conversion rate optimization, Google/LinkedIn ads, and lifecycle email loops.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-border">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    B2B SEO
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    Paid Ads
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-surface-border text-ink-secondary">
                    Lifecycle CRO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Open-Book Budget Split Calculator Section */}
        <section id="calculator" className="py-20 bg-surface-subtle border-b border-surface-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                ZERO HIDDEN MARKUPS
              </span>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight">
                Open-Book Budget Transparency
              </h2>
              <p className="text-sm text-ink-secondary">
                See exactly where every dollar goes before signing. Bench contractors know the gross client budget,
                and clients know exact specialist compensation.
              </p>
            </div>

            <BudgetCalculator />
          </div>
        </section>

        {/* 6-Stage Workflow Explainer */}
        <section id="workflow" className="py-20 bg-white border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                OPERATING DISCIPLINE
              </span>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight">
                6-Stage Founder-Managed Delivery Protocol
              </h2>
              <p className="text-sm text-ink-secondary">
                From intake to split payout release, our 2 founders actively supervise each milestone gate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Stage 1 */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  01
                </div>
                <h3 className="text-base font-bold text-ink-primary">Structured Intake</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Freelancers submit deep portfolios; clients submit guided briefs with target budget and timeline.
                </p>
              </div>

              {/* Stage 2 */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  02
                </div>
                <h3 className="text-base font-bold text-ink-primary">15-Min Founder Vetting</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Two founders personally interview applicants, verify technical depth, and calibrate availability.
                </p>
              </div>

              {/* Stage 3 */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  03
                </div>
                <h3 className="text-base font-bold text-ink-primary">Fixed Scoping & 50/30/20</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Briefs are converted into fixed-scope milestones with an explicit 2-round revision cap.
                </p>
              </div>

              {/* Stage 4 */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  04
                </div>
                <h3 className="text-base font-bold text-ink-primary">Open-Book Pod Offer</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Specialists review the full client gross budget, platform fee %, and exact fixed payout before e-signing.
                </p>
              </div>

              {/* Stage 5 */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  05
                </div>
                <h3 className="text-base font-bold text-ink-primary">Founder QA Review Gate</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Talent submits deliverables to founders first. We test and approve before exposing to the client.
                </p>
              </div>

              {/* Stage 6 */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  06
                </div>
                <h3 className="text-base font-bold text-ink-primary">Automated Split Payout</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Once client approves milestone, split payouts release immediately via Wise/IBAN or UPI with India TDS compliance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-surface-subtle border-b border-surface-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                TRANSPARENCY FAQ
              </span>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight">
                Clear Answers to Critical Questions
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-white border border-surface-border">
                <h4 className="text-base font-bold text-ink-primary mb-2">
                  How does OpenBench protect against disintermediation?
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Both talent and clients sign binding non-circumvention terms (12 months). More importantly, neither
                  party wants to disintermediate: clients love having 2 founders actively PMing, managing QA, and
                  holding escrow; freelancers love having guaranteed payments, zero sales overhead, and warm bench matching.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-surface-border">
                <h4 className="text-base font-bold text-ink-primary mb-2">
                  What happens when a client asks for endless revisions?
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Every milestone has a strict default 2-round revision cap baked into the Scope of Work. Once the
                  counter hits 2/2, the client portal automatically freezes extra revision requests and prompts a
                  formal Change Order with additional budget.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-surface-border">
                <h4 className="text-base font-bold text-ink-primary mb-2">
                  How are international payments and India taxes handled?
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  US, UK, and EU talent receive payments in USD/GBP/EUR via Wise or IBAN. For Indian contractors,
                  we automatically calculate Section 194J (10% professional) or 194C (1-2% contractual) TDS deductions,
                  log PAN/GSTIN details, and provide verifiable payout receipts for tax filing.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-surface-border">
                <h4 className="text-base font-bold text-ink-primary mb-2">
                  Why not just hire full-time or hire directly on Upwork?
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Traditional platforms leave you with hundreds of unvetted proposals, zero QA oversight, and high
                  hidden commission fees. OpenBench delivers pre-assembled pods ready in 72h with 100% open-book math
                  and two experienced founders standing behind the work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Kick Off Within 72 Hours?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Submit your brief or join the vetted bench. No passive waiting, no black-box agency margins.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/start-project"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-sm hover:bg-accent-cobalt-hover shadow-lg transition-colors"
              >
                Submit Project Brief
              </Link>
              <Link
                to="/join"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Apply to Bench
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

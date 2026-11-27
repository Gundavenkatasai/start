import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BudgetCalculator } from '../../components/shared/BudgetCalculator';
import { Badge } from '../../components/ui/Badge';
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
  ChevronDown,
  Sparkles,
  Award,
  Globe2,
  Check,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does OpenBench protect against disintermediation?',
      a: 'Both talent and clients sign binding non-circumvention terms (12 months). More importantly, neither party wants to disintermediate: clients love having 2 founders actively PMing, managing QA reviews, and holding milestone escrow; freelancers love having guaranteed fixed payouts, zero sales overhead, and warm bench matching.',
    },
    {
      q: 'What happens when a client asks for endless revisions?',
      a: 'Every milestone has a strict default 2-round revision cap baked into the Scope of Work. Once the counter hits 2/2, the client portal automatically freezes extra revision requests and prompts a formal Change Order with additional budget before any further work is executed.',
    },
    {
      q: 'How are international payments and India taxes handled?',
      a: 'US, UK, and EU talent receive payments in USD/GBP/EUR via Wise or direct local IBAN. For Indian contractors, we automatically calculate Section 194J (10% professional) or 194C (1-2% contractual) TDS deductions, capture PAN/GSTIN details, and provide verifiable payout receipts for tax filing.',
    },
    {
      q: 'Why not just hire full-time or hire directly on Upwork?',
      a: 'Traditional platforms leave you with hundreds of unvetted proposals, zero QA oversight, and high hidden commission fees. OpenBench delivers pre-assembled pods ready in <72 hours with 100% open-book math, fixed milestone escrow, and two experienced founders standing behind every line of work.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Answer-First Hero Section with Soft Ambient Light */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-surface-border bg-gradient-to-b from-white via-surface-subtle/50 to-white">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 via-indigo-50/20 to-transparent pointer-events-none blur-3xl opacity-70" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2">
                <Badge variant="primary" dot pulse className="py-1 px-3 shadow-subtle">
                  <span>Operating across US, UK, Europe & India</span>
                </Badge>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink-primary tracking-tight leading-[1.15] font-sans">
                Transparent Managed <br className="hidden sm:inline" />
                <span className="text-accent-cobalt">Talent Collective</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl mx-auto">
                Not a passive waitlist or opaque agency markup. We match senior freelance pods on an{' '}
                <strong className="text-ink-primary font-semibold">open-book 70/30 split</strong> with
                founder-managed QA review and guaranteed milestone escrow.
              </p>

              {/* Dual CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  to="/start-project"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/join"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-ink-primary font-semibold text-sm hover:bg-surface-subtle border border-surface-border shadow-subtle hover:border-slate-300 transition-all flex items-center justify-center"
                >
                  Join the Talent Bench
                </Link>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
                <div className="text-center p-4 rounded-2xl bg-white border border-surface-border/80 shadow-subtle">
                  <div className="text-2xl font-bold font-mono text-ink-primary">&lt; 72 Hours</div>
                  <div className="text-[11px] font-mono text-ink-secondary mt-1">Bench Warmth Kickoff</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white border border-surface-border/80 shadow-subtle">
                  <div className="text-2xl font-bold font-mono text-accent-emerald">70 / 30</div>
                  <div className="text-[11px] font-mono text-ink-secondary mt-1">Open-Book Split</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white border border-surface-border/80 shadow-subtle">
                  <div className="text-2xl font-bold font-mono text-ink-primary">50/30/20</div>
                  <div className="text-[11px] font-mono text-ink-secondary mt-1">Milestone Escrow</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white border border-surface-border/80 shadow-subtle">
                  <div className="text-2xl font-bold font-mono text-accent-cobalt">2 Founders</div>
                  <div className="text-[11px] font-mono text-ink-secondary mt-1">Direct QA & Sign-off</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Launch Skill Verticals */}
        <section id="verticals" className="py-20 bg-white border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="primary">LAUNCH CAPABILITIES</Badge>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight font-sans">
                4 Core Engineering & Creative Verticals
              </h2>
              <p className="text-sm text-ink-secondary">
                Pre-vetted specialists working in synchronized pods rather than isolated solo gigs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Vertical 1: Web & App Dev */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-cobalt/50 hover:shadow-card-hover transition-all duration-200 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink-primary mb-2">Web & App Development</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                    Full-stack React 19, Next.js, Node.js, TypeScript, PostgreSQL, and React Native mobile apps.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border/80">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    React 19
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    TypeScript
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    Node.js
                  </span>
                </div>
              </div>

              {/* Vertical 2: UI/UX Design */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-purple/50 hover:shadow-card-hover transition-all duration-200 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent-purple-light text-accent-purple border border-accent-purple-border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Palette className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink-primary mb-2">UI/UX Product Design</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                    Enterprise design systems, interactive prototypes, user journeys, and component architecture in Figma.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border/80">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    Figma
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    Design Systems
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    Tokens
                  </span>
                </div>
              </div>

              {/* Vertical 3: Video Editing */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-rose/50 hover:shadow-card-hover transition-all duration-200 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent-rose-light text-accent-rose border border-accent-rose-border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Film className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink-primary mb-2">Video & Motion Editing</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                    High-converting SaaS product demos, motion graphics, investor launch videos, and social shorts.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border/80">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    Premiere
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    After Effects
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    Motion
                  </span>
                </div>
              </div>

              {/* Vertical 4: Digital Marketing */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border hover:border-accent-emerald/50 hover:shadow-card-hover transition-all duration-200 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent-emerald-light text-accent-emerald border border-accent-emerald-border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink-primary mb-2">Digital Growth Marketing</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                    Technical B2B SEO, conversion rate optimization, Google/LinkedIn ads, and lifecycle email loops.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border/80">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    B2B SEO
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    Paid Ads
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-surface-border text-ink-secondary">
                    CRO
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
              <Badge variant="primary">ZERO HIDDEN MARKUPS</Badge>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight font-sans">
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
              <Badge variant="primary">OPERATING DISCIPLINE</Badge>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight font-sans">
                6-Stage Founder-Managed Delivery Protocol
              </h2>
              <p className="text-sm text-ink-secondary">
                From intake to split payout release, our 2 founders actively supervise each milestone gate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Structured Intake',
                  desc: 'Freelancers submit verified case studies; clients submit guided briefs with target budgets and timelines.',
                },
                {
                  step: '02',
                  title: '15-Min Founder Vetting',
                  desc: 'Two founders personally interview applicants, verify technical depth, and calibrate availability.',
                },
                {
                  step: '03',
                  title: 'Fixed Scoping & 50/30/20',
                  desc: 'Briefs are converted into fixed-scope milestones with an explicit 2-round revision cap.',
                },
                {
                  step: '04',
                  title: 'Open-Book Pod Offer',
                  desc: 'Specialists review the full client gross budget, platform fee %, and exact fixed payout before e-signing.',
                },
                {
                  step: '05',
                  title: 'Founder QA Review Gate',
                  desc: 'Talent submits deliverables to founders first. We inspect code and polish design before client review.',
                },
                {
                  step: '06',
                  title: 'Automated Split Payout',
                  desc: 'Once milestone is approved, payouts release immediately via Wise/IBAN or UPI with India TDS compliance.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl bg-surface-subtle/80 border border-surface-border hover:bg-white hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 space-y-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border font-mono font-bold text-xs flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-ink-primary font-sans">{item.title}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-surface-subtle border-b border-surface-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="primary">TRANSPARENCY FAQ</Badge>
              <h2 className="text-3xl font-bold text-ink-primary tracking-tight font-sans">
                Clear Answers to Critical Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-surface-border overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-ink-primary hover:text-accent-cobalt transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-ink-muted transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-accent-cobalt' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-ink-secondary leading-relaxed border-t border-surface-border/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final High-Trust CTA Banner with Simple Light Aesthetic */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border border-blue-100 shadow-smooth text-center space-y-6 relative overflow-hidden">
              <div className="inline-flex items-center gap-2">
                <Badge variant="primary" dot pulse>
                  Ready to Kick Off Within 72 Hours
                </Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight font-sans">
                Start Your Next Milestone with Absolute Clarity
              </h2>
              <p className="text-ink-secondary max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
                Submit your brief or join our vetted bench. No passive waiting, no black-box agency margins,
                and guaranteed founder PM review.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  to="/start-project"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-accent-cobalt text-white font-semibold text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Project Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/join"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-ink-primary font-semibold text-sm hover:bg-surface-subtle border border-surface-border shadow-subtle hover:border-slate-300 transition-all flex items-center justify-center"
                >
                  Apply to Talent Bench
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

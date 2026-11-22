import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe2, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-dark text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-cobalt flex items-center justify-center text-white font-mono font-bold text-sm">
                OB
              </div>
              <span className="text-xl font-bold text-white tracking-tight">OpenBench</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Transparent Managed Talent Collective operating across the US, UK, Europe, and India.
              Vetted senior bench with open-book budget splits and founder-level QA sign-off.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>72h Bench Warmth Ping System Active</span>
            </div>
          </div>

          {/* Launch Verticals */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Launch Verticals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors">Web & App Development</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">UI/UX Product Design</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Video Editing & Motion</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Digital Growth Marketing</span>
              </li>
            </ul>
          </div>

          {/* Model & Standards */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Open-Book Model
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors">70% Execution Pod Pool</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">30% Transparent Platform Margin</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">50/30/20 Milestone Escrow</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Strict 2-Round Revision Cap</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">India TDS Section 194J/C</span>
              </li>
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Operating Hubs
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🇺🇸</span>
                <span>New York & San Francisco</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🇬🇧</span>
                <span>London & Manchester</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🇪🇺</span>
                <span>Berlin & Paris</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🇮🇳</span>
                <span>Bengaluru & Mumbai</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} OpenBench Collective Inc. Zero floating-point rounding. Master Contractor SOW enforced.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/join" className="hover:text-slate-300">
              Talent Intake
            </Link>
            <Link to="/start-project" className="hover:text-slate-300">
              Submit Brief
            </Link>
            <Link to="/login" className="hover:text-slate-300">
              Console Sign-In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

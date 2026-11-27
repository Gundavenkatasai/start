import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe2, ArrowUpRight, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-subtle text-ink-secondary py-16 border-t border-surface-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-surface-border/80">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-accent-cobalt flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
                OB
              </div>
              <span className="text-xl font-bold text-ink-primary tracking-tight font-sans">
                Open<span className="text-accent-cobalt">Bench</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-sm leading-relaxed">
              Transparent Managed Talent Collective operating across the US, UK, Europe, and India.
              Vetted senior bench with open-book budget splits and founder-level QA sign-off.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" dot pulse>
                72h Bench Warmth Ping Active
              </Badge>
            </div>
          </div>

          {/* Launch Verticals */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary mb-4">
              Launch Verticals
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">Web & App Development</span>
              </li>
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">UI/UX Product Design</span>
              </li>
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">Video Editing & Motion</span>
              </li>
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">Digital Growth Marketing</span>
              </li>
            </ul>
          </div>

          {/* Model & Standards */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary mb-4">
              Open-Book Model
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">70% Execution Pod Pool</span>
              </li>
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">30% Transparent Margin</span>
              </li>
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">50/30/20 Milestone Escrow</span>
              </li>
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">Strict 2-Round Revision Cap</span>
              </li>
              <li>
                <span className="hover:text-ink-primary transition-colors cursor-pointer">India TDS Section 194J/C</span>
              </li>
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary mb-4">
              Operating Hubs
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-ink-secondary">
              <div className="flex items-center gap-2">
                <span className="text-xs">🇺🇸</span>
                <span>New York & San Francisco</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">🇬🇧</span>
                <span>London & Manchester</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">🇪🇺</span>
                <span>Berlin & Paris</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">🇮🇳</span>
                <span>Bengaluru & Mumbai</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink-muted">
          <div>
            © {new Date().getFullYear()} OpenBench Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-ink-primary transition-colors cursor-pointer">Master Contractor Terms</span>
            <span className="hover:text-ink-primary transition-colors cursor-pointer">Non-Circumvention Policy</span>
            <span className="hover:text-ink-primary transition-colors cursor-pointer">Escrow Protocols</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

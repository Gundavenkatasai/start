import React, { useState } from 'react';
import { Currency } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { ShieldCheck, Layers, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const BudgetCalculator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [budget, setBudget] = useState<number>(10000); // in major units

  const minorUnits = budget * 100;

  // 70/30 Split Calculations
  const podShare = Math.round(minorUnits * 0.7);
  const platformShare = Math.round(minorUnits * 0.3);

  // Platform Breakdown: 12% sales/ops, 10% PM/QA, 8% reserve
  const salesOps = Math.round(minorUnits * 0.12);
  const pmQa = Math.round(minorUnits * 0.1);
  const reserve = Math.round(minorUnits * 0.08);

  // 50/30/20 Milestones
  const m1 = Math.round(minorUnits * 0.5);
  const m2 = Math.round(minorUnits * 0.3);
  const m3 = minorUnits - (m1 + m2);

  const currencyPresets: Record<Currency, number[]> = {
    USD: [5000, 10000, 25000, 50000],
    GBP: [4000, 8000, 20000, 40000],
    EUR: [4500, 9000, 22000, 45000],
    INR: [400000, 800000, 2000000, 4000000],
  };

  const handleCurrencyChange = (newCurr: Currency) => {
    setCurrency(newCurr);
    setBudget(currencyPresets[newCurr][1]);
  };

  return (
    <div className={`bg-white rounded-3xl border border-surface-border shadow-smooth transition-all ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 md:p-10'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" dot pulse>
              OPEN-BOOK PROTOCOL
            </Badge>
            <span className="text-xs font-mono text-ink-muted">Transparent 70/30 Split</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-ink-primary font-sans">
            Interactive Project Budget Calculator
          </h3>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Zero hidden markups. Every dollar, pound, euro, or rupee is auditable before contracts are signed.
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center bg-surface-secondary/80 p-1 rounded-2xl border border-surface-border self-start">
          {(['USD', 'GBP', 'EUR', 'INR'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencyChange(c)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xl transition-all duration-200 ${
                currency === c
                  ? 'bg-white text-ink-primary shadow-subtle border border-surface-border'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-white/50'
              }`}
            >
              {c === 'USD' && '$ USD'}
              {c === 'GBP' && '£ GBP'}
              {c === 'EUR' && '€ EUR'}
              {c === 'INR' && '₹ INR'}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Slider & Preset Buttons */}
      <div className="py-6 border-b border-surface-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider font-mono">
            Sample Gross Client Budget
          </label>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-accent-cobalt">
            {formatCurrency(minorUnits, currency)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {currencyPresets[currency].map((preset) => (
            <button
              key={preset}
              onClick={() => setBudget(preset)}
              className={`px-3.5 py-1.5 text-xs font-mono rounded-xl border transition-all duration-200 ${
                budget === preset
                  ? 'bg-accent-cobalt-light text-accent-cobalt border-accent-cobalt-border font-semibold shadow-subtle'
                  : 'bg-white text-ink-secondary border-surface-border hover:bg-surface-subtle hover:border-slate-300'
              }`}
            >
              {formatCurrency(preset * 100, currency)}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={currencyPresets[currency][0]}
          max={currencyPresets[currency][3]}
          step={currency === 'INR' ? 50000 : 1000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-accent-cobalt transition-colors"
        />
        <div className="flex justify-between text-[11px] font-mono text-ink-muted mt-2">
          <span>{formatCurrency(currencyPresets[currency][0] * 100, currency)}</span>
          <span>{formatCurrency(currencyPresets[currency][3] * 100, currency)}</span>
        </div>
      </div>

      {/* Primary Split Showcase: 70% Talent Pod vs 30% Managed Delivery */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 70% Talent Pod Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-100 shadow-subtle relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-emerald flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              Talent Pod Allocation
            </span>
            <Badge variant="success">70.0% Payout</Badge>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-accent-emerald mb-1">
            {formatCurrency(podShare, currency)}
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Directly distributed to the pre-vetted specialists in the execution pod. Fixed payouts guaranteed before contract acceptance.
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-[11px] font-mono text-ink-secondary">
            <span>Disbursed via Escrow</span>
            <span className="text-accent-emerald font-semibold">Zero agency cuts</span>
          </div>
        </div>

        {/* 30% Platform Ops Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 shadow-subtle relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-cobalt" />
              Founder-Managed Delivery
            </span>
            <Badge variant="primary">30.0% Platform</Badge>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-ink-primary mb-1">
            {formatCurrency(platformShare, currency)}
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Covers personal founder scoping, milestone QA reviews, non-circumvention contracts, and backup reserve coverage.
          </p>

          {/* Internal 30% breakdown */}
          <div className="mt-4 pt-3 border-t border-blue-100/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-ink-secondary">
            <div className="bg-white/80 p-2 rounded-xl border border-surface-border text-center">
              <div className="font-bold text-ink-primary">12%</div>
              <div className="text-ink-muted text-[9px] mt-0.5">Sales & Ops</div>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-surface-border text-center">
              <div className="font-bold text-accent-cobalt">10%</div>
              <div className="text-ink-muted text-[9px] mt-0.5">QA & Review</div>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-surface-border text-center">
              <div className="font-bold text-emerald-600">8%</div>
              <div className="text-ink-muted text-[9px] mt-0.5">Reserve Fund</div>
            </div>
          </div>
        </div>
      </div>

      {/* 50 / 30 / 20 Milestone Escrow Schedule */}
      <div className="mt-2 p-5 sm:p-6 rounded-2xl bg-surface-subtle/80 border border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-cobalt" />
            <span>Guaranteed 50 / 30 / 20 Milestone Escrow Schedule</span>
          </h4>
          <span className="text-[11px] font-mono text-ink-muted">Funds protected in neutral escrow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Milestone 1 */}
          <div className="p-4 rounded-xl bg-white border border-surface-border/80 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="font-semibold text-accent-cobalt">Milestone 1 (50%)</span>
                <span className="text-ink-muted">Upfront</span>
              </div>
              <div className="text-lg font-bold font-mono text-ink-primary">
                {formatCurrency(m1, currency)}
              </div>
            </div>
            <p className="text-[11px] text-ink-secondary mt-2 leading-relaxed">
              Deposited to lock pod members, initiate kickoff, and finalize technical specification.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="p-4 rounded-xl bg-white border border-surface-border/80 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="font-semibold text-accent-cobalt">Milestone 2 (30%)</span>
                <span className="text-ink-muted">Mid-Delivery</span>
              </div>
              <div className="text-lg font-bold font-mono text-ink-primary">
                {formatCurrency(m2, currency)}
              </div>
            </div>
            <p className="text-[11px] text-ink-secondary mt-2 leading-relaxed">
              Released upon completed prototype, code inspection, and core feature demonstration.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="p-4 rounded-xl bg-white border border-surface-border/80 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="font-semibold text-accent-emerald">Milestone 3 (20%)</span>
                <span className="text-ink-muted">Final Sign-off</span>
              </div>
              <div className="text-lg font-bold font-mono text-ink-primary">
                {formatCurrency(m3, currency)}
              </div>
            </div>
            <p className="text-[11px] text-ink-secondary mt-2 leading-relaxed">
              Released upon final client approval, documentation transfer, and QA sign-off.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

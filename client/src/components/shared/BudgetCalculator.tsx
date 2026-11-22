import React, { useState } from 'react';
import { Currency } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { ShieldCheck, Layers, Award, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className={`bg-white rounded-2xl border border-surface-border shadow-elevated ${compact ? 'p-5' : 'p-6 md:p-8'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-accent-cobalt border border-blue-200">
              OPEN-BOOK PROTOCOL
            </span>
            <span className="text-xs font-mono text-ink-muted">70/30 Split Rule</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-ink-primary mt-1">
            Interactive Project Budget Calculator
          </h3>
          <p className="text-sm text-ink-secondary mt-0.5">
            100% transparency. Every dollar or rupee is mapped before work begins.
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center bg-surface-secondary p-1 rounded-xl border border-surface-border self-start">
          {(['USD', 'GBP', 'EUR', 'INR'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencyChange(c)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                currency === c
                  ? 'bg-white text-ink-primary shadow-sm border border-surface-border'
                  : 'text-ink-secondary hover:text-ink-primary'
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
      <div className="py-6 border-b border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-sm font-semibold text-ink-secondary uppercase tracking-wider font-mono">
            Sample Gross Project Budget
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
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
                budget === preset
                  ? 'bg-accent-cobalt text-white border-accent-cobalt'
                  : 'bg-surface-subtle text-ink-secondary border-surface-border hover:bg-white'
              }`}
            >
              {formatCurrency(preset * 100, currency)}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={currency === 'INR' ? 100000 : 2500}
          max={currency === 'INR' ? 10000000 : 100000}
          step={currency === 'INR' ? 50000 : 500}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-accent-cobalt"
        />
      </div>

      {/* 70/30 High-Level Split Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* 70% Execution Pod */}
        <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              70% Execution Pod Share
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-accent-emerald text-white">
              70.0%
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-emerald-900 mt-2">
            {formatCurrency(podShare, currency)}
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            Paid directly to the vetted senior specialists in the project pod based on assigned role weights.
          </p>
        </div>

        {/* 30% Platform & Ops */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
              30% Platform & Ops Margin
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-slate-800 text-white">
              30.0%
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900 mt-2">
            {formatCurrency(platformShare, currency)}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Covers 2-person founder scoping, QA review gate, contract administration, and delivery guarantee reserve.
          </p>
        </div>
      </div>

      {/* Itemized Platform Breakdown */}
      <div className="bg-surface-subtle p-5 rounded-xl border border-surface-border mb-6">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mb-3">
          Itemized Platform Margin Breakdown (30%)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border border-surface-border">
            <div className="text-xs text-ink-secondary">Sales & Client Ops (12%)</div>
            <div className="text-base font-bold font-mono text-ink-primary mt-0.5">
              {formatCurrency(salesOps, currency)}
            </div>
            <div className="text-[11px] text-ink-muted mt-0.5">Invoicing, brief alignment, legal SOW</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-surface-border">
            <div className="text-xs text-ink-secondary">Founder PM & QA Gate (10%)</div>
            <div className="text-base font-bold font-mono text-ink-primary mt-0.5">
              {formatCurrency(pmQa, currency)}
            </div>
            <div className="text-[11px] text-ink-muted mt-0.5">Two founders test and review every milestone</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-surface-border">
            <div className="text-xs text-ink-secondary">Backup Reserve & Float (8%)</div>
            <div className="text-base font-bold font-mono text-ink-primary mt-0.5">
              {formatCurrency(reserve, currency)}
            </div>
            <div className="text-[11px] text-ink-muted mt-0.5">Instant backup talent replacement warranty</div>
          </div>
        </div>
      </div>

      {/* 50/30/20 Milestone Delivery & Payout Schedule */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
            50% / 30% / 20% Milestone Release Schedule
          </h4>
          <span className="text-xs font-mono text-ink-secondary">Fixed Project Pricing</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-surface-border hover:border-accent-cobalt transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-accent-cobalt font-mono font-bold text-xs flex items-center justify-center">
                M1
              </span>
              <div>
                <div className="text-sm font-semibold text-ink-primary">
                  50% Upfront Deposit & Architecture Kickoff
                </div>
                <div className="text-xs text-ink-secondary">
                  Locks the pod bench, establishes repository & Figma specs.
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold font-mono text-ink-primary">
                {formatCurrency(m1, currency)}
              </div>
              <span className="text-[11px] font-mono text-accent-emerald">50% Escrow</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-surface-border hover:border-accent-cobalt transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-accent-cobalt font-mono font-bold text-xs flex items-center justify-center">
                M2
              </span>
              <div>
                <div className="text-sm font-semibold text-ink-primary">
                  30% Mid-Delivery & Founder QA Demo
                </div>
                <div className="text-xs text-ink-secondary">
                  Functional preview, QA gate approval, client review round 1.
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold font-mono text-ink-primary">
                {formatCurrency(m2, currency)}
              </div>
              <span className="text-[11px] font-mono text-ink-muted">30% Progress</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-surface-border hover:border-accent-cobalt transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-accent-cobalt font-mono font-bold text-xs flex items-center justify-center">
                M3
              </span>
              <div>
                <div className="text-sm font-semibold text-ink-primary">
                  20% Final Sign-Off, IP Transfer & Handover
                </div>
                <div className="text-xs text-ink-secondary">
                  Full IP assignment transfer, production deploy, warranty sign-off.
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold font-mono text-ink-primary">
                {formatCurrency(m3, currency)}
              </div>
              <span className="text-[11px] font-mono text-accent-emerald">20% Sign-off</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

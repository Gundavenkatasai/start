import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { BenchStatusBadge } from '../../components/shared/StatusBadge';
import { getCategoryLabel } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { UserCheck, ShieldCheck, CreditCard, Building2, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const TalentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [payoutMethod, setPayoutMethod] = useState<'BANK_TRANSFER' | 'UPI' | 'WISE' | 'IBAN'>('WISE');
  const [payoutDetails, setPayoutDetails] = useState<any>({ accountHolder: '', details: '' });
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [tdsCategory, setTdsCategory] = useState('TECHNICAL_PROFESSIONAL_10');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/auth/me');
        if (res.success && res.data) {
          const p = res.data.talentProfile;
          setProfile(p);
          if (p) {
            setPayoutMethod(p.payoutMethod || 'WISE');
            setPayoutDetails(p.payoutDetails || { accountHolder: '', details: '' });
            setPanNumber(p.panNumber || '');
            setGstin(p.gstin || '');
            setTdsCategory(p.tdsCategory || 'TECHNICAL_PROFESSIONAL_10');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await api.put('/talent/tax-payout', {
        payoutMethod,
        payoutDetails,
        panNumber,
        gstin,
        tdsCategory,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update payout settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center font-mono text-xs text-ink-muted">
          Loading profile...
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border flex items-center justify-center font-bold text-2xl font-mono shrink-0 shadow-subtle">
              {user?.fullName?.charAt(0) || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-ink-muted">SPECIALIST ACCOUNT:</span>
                <BenchStatusBadge status={profile?.status || 'ACTIVE_BENCH'} />
              </div>
              <h1 className="text-2xl font-bold text-ink-primary font-sans">{user?.fullName}</h1>
              <p className="text-xs text-ink-secondary mt-0.5">
                {user?.email} • {user?.country} • {profile?.yearsExperience} years experience
              </p>
            </div>
          </div>

          <Badge variant="primary" dot pulse>
            {getCategoryLabel(profile?.primaryCategory)}
          </Badge>
        </div>

        {/* Payout & Tax Settings Form */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-surface-border shadow-smooth space-y-6">
          <div>
            <Badge variant="primary" size="sm">COMPLIANCE & DISBURSAL</Badge>
            <h2 className="text-xl font-bold text-ink-primary font-sans mt-2">
              Bank Account & Statutory Tax Profile
            </h2>
            <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
              Disbursals are released automatically upon milestone completion. Keep banking and tax details verified.
            </p>
          </div>

          {success && (
            <div className="p-4 rounded-2xl bg-accent-emerald-light border border-accent-emerald-border text-xs text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
              <span>Tax and payout details updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-accent-rose-light border border-accent-rose-border text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent-rose shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Payout Method */}
            <div className="space-y-3">
              <label className="block font-semibold text-ink-primary font-sans">
                Preferred Disbursal Method *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'WISE', label: 'Wise (Global)' },
                  { id: 'BANK_TRANSFER', label: 'Direct Bank Wire' },
                  { id: 'UPI', label: 'UPI (India)' },
                  { id: 'IBAN', label: 'IBAN / SEPA (EU/UK)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayoutMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-center font-mono text-xs transition-all ${
                      payoutMethod === m.id
                        ? 'bg-accent-cobalt-light border-accent-cobalt text-accent-cobalt font-bold shadow-subtle'
                        : 'bg-white border-surface-border text-ink-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-ink-primary mb-1.5 font-sans">
                  Account Holder Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={payoutDetails.accountHolder}
                  onChange={(e) =>
                    setPayoutDetails({ ...payoutDetails, accountHolder: e.target.value })
                  }
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1.5 font-sans">
                  Account Details (UPI ID / IBAN / Swift / Account #) *
                </label>
                <input
                  type="text"
                  required
                  value={payoutDetails.details}
                  onChange={(e) =>
                    setPayoutDetails({ ...payoutDetails, details: e.target.value })
                  }
                  placeholder="e.g. marcus@okaxis or GB29X... or Wise email"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono transition-all shadow-subtle"
                />
              </div>
            </div>

            {/* Tax Details (India PAN / Global W-8BEN) */}
            <div className="pt-4 border-t border-surface-border/80 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-primary font-sans">
                Tax Compliance & Withholding
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5 font-sans">
                    Permanent Account Number (PAN) / Tax ID
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono uppercase transition-all shadow-subtle"
                  />
                  <span className="text-[11px] text-ink-muted mt-1 block">
                    Required for Indian contractors under Section 194J/194C TDS.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5 font-sans">
                    GSTIN (Optional, for Indian registered entities)
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono uppercase transition-all shadow-subtle"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1.5 font-sans">
                  Applicable Indian TDS Bracket
                </label>
                <select
                  value={tdsCategory}
                  onChange={(e) => setTdsCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono transition-all shadow-subtle"
                >
                  <option value="TECHNICAL_PROFESSIONAL_10">
                    Section 194J (10%) — Technical & Professional Services
                  </option>
                  <option value="CONTRACTOR_2">
                    Section 194C (2%) — Company Contractor / Works Contract
                  </option>
                  <option value="INDIVIDUAL_CONTRACTOR_1">
                    Section 194C (1%) — Individual Contractor / Freelancer
                  </option>
                  <option value="EXEMPT_NON_INDIA">
                    Non-India Tax Resident (W-8BEN / Direct Gross Payout)
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border/80 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Settings...' : 'Save Payout Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

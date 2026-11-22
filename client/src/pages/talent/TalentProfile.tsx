import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { BenchStatusBadge } from '../../components/shared/StatusBadge';
import { getCategoryLabel } from '../../lib/formatters';
import { UserCheck, ShieldCheck, CreditCard, Building2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

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
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-mono font-bold text-xl flex items-center justify-center">
              {user?.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-ink-primary">{user?.fullName}</h1>
                {profile && <BenchStatusBadge status={profile.status} />}
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                {profile ? getCategoryLabel(profile.primaryCategory) : 'Specialist'} • {user?.country}
              </p>
            </div>
          </div>

          {profile?.internalRating && (
            <div className="bg-surface-subtle p-3 rounded-xl border border-surface-border text-center self-start sm:self-center">
              <span className="text-[10px] font-mono text-ink-muted block uppercase">Vetted Delivery Rating</span>
              <span className="text-lg font-bold font-mono text-accent-cobalt">
                ⭐ {profile.internalRating} / 5.0
              </span>
            </div>
          )}
        </div>

        {/* Payout & Tax Settings Form */}
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
              DISBURSEMENT & TAX SETTINGS
            </span>
            <h2 className="text-xl font-bold text-ink-primary mt-1">
              Bank, UPI & Compliance Information
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Configures how your milestone split payouts are routed to your local banking account.
            </p>
          </div>

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
              <span>Tax and payout details saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Payout Method Selection */}
          <div className="space-y-4 border-t border-surface-border pt-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
              1. Preferred Payout Rails
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['WISE', 'IBAN', 'UPI', 'BANK_TRANSFER'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayoutMethod(method)}
                  className={`p-3 rounded-xl border text-center text-xs font-mono font-semibold transition-all ${
                    payoutMethod === method
                      ? 'bg-blue-50 text-accent-cobalt border-accent-cobalt shadow-sm'
                      : 'bg-surface-subtle text-ink-secondary border-surface-border hover:bg-white'
                  }`}
                >
                  {method === 'WISE' && 'Wise (USD/GBP)'}
                  {method === 'IBAN' && 'IBAN (EU/UK)'}
                  {method === 'UPI' && 'UPI (India)'}
                  {method === 'BANK_TRANSFER' && 'Direct Bank'}
                </button>
              ))}
            </div>

            {/* Method Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1">
                  Beneficiary / Account Holder Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={payoutDetails.accountHolder || ''}
                  onChange={(e) => setPayoutDetails({ ...payoutDetails, accountHolder: e.target.value })}
                  placeholder={user?.fullName || 'Full Legal Name'}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1">
                  {payoutMethod === 'UPI' && 'UPI Virtual Payment Address (e.g. name@oksbi)'}
                  {payoutMethod === 'WISE' && 'Wise Registered Email Address'}
                  {payoutMethod === 'IBAN' && 'IBAN & SWIFT / BIC Code'}
                  {payoutMethod === 'BANK_TRANSFER' && 'Account Number, Bank Name & Routing / IFSC'}
                </label>
                <input
                  type="text"
                  required
                  value={payoutDetails.details || ''}
                  onChange={(e) => setPayoutDetails({ ...payoutDetails, details: e.target.value })}
                  placeholder={
                    payoutMethod === 'UPI'
                      ? 'arjun@oksbi'
                      : payoutMethod === 'WISE'
                      ? user?.email || 'name@wise.com'
                      : 'GB29NWBK60161331926819'
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* India Compliance Fields */}
          <div className="space-y-4 border-t border-surface-border pt-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
              2. India Compliance & TDS Withholding (Optional for Non-India)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1">PAN Number (Permanent Account Number)</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1">GSTIN (If Registered)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-border focus:border-accent-cobalt outline-none font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Applicable India TDS Rate</label>
              <select
                value={tdsCategory}
                onChange={(e) => setTdsCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none"
              >
                <option value="TECHNICAL_PROFESSIONAL_10">Section 194J — 10% (Technical / Professional Services)</option>
                <option value="CONTRACTUAL_1_OR_2">Section 194C — 1% (Contractual Work / Individual)</option>
                <option value="NONE">None / Non-India Tax Resident (0%)</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 border-t border-surface-border flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-accent-cobalt text-white font-semibold text-xs hover:bg-accent-cobalt-hover shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Payout Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { api } from '../../lib/api';
import { AvailabilityStatus } from '../../types';
import { ShieldCheck, CheckCircle2, Clock, Calendar, Ban, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const AvailabilityConfirmPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [talentData, setTalentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokenInfo() {
      try {
        const res = await api.get(`/public/availability/${token}`);
        if (res.success && res.data) {
          setTalentData(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Invalid or expired availability confirmation link');
      } finally {
        setLoading(false);
      }
    }
    fetchTokenInfo();
  }, [token]);

  const handleUpdate = async (status: AvailabilityStatus) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await api.post(`/public/availability/${token}`, {
        availabilityStatus: status,
      });
      if (res.success) {
        setSuccessMessage(res.message);
        setTalentData((prev: any) => ({
          ...prev,
          currentAvailability: status,
          lastConfirmedAt: new Date().toISOString(),
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update availability status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-smooth text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border flex items-center justify-center mx-auto shadow-subtle">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <Badge variant="primary" dot pulse>
              ONE-CLICK BENCH PING
            </Badge>
            <h1 className="text-2xl font-bold text-ink-primary font-sans mt-2">
              Update Project Capacity
            </h1>
            <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
              Passwordless confirmation. Keeps the bench warm for upcoming client project pods.
            </p>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center gap-2 text-ink-muted">
              <Loader2 className="w-6 h-6 animate-spin text-accent-cobalt" />
              <span className="text-xs font-mono">Verifying secure token...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-accent-rose-light border border-accent-rose-border text-xs text-rose-800 text-left">
              {error}
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="p-3.5 bg-surface-subtle/80 rounded-2xl border border-surface-border text-xs">
                <div className="text-ink-secondary">Specialist:</div>
                <div className="text-sm font-bold text-ink-primary font-sans">{talentData.fullName}</div>
                <div className="text-[11px] text-ink-muted font-mono mt-0.5">
                  {talentData.country} ({talentData.timezone})
                </div>
              </div>

              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-accent-emerald-light border border-accent-emerald-border text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                {/* Option 1: Available Now */}
                <button
                  onClick={() => handleUpdate('AVAILABLE_NOW')}
                  disabled={updating}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between ${
                    talentData.currentAvailability === 'AVAILABLE_NOW'
                      ? 'bg-accent-emerald-light/60 border-accent-emerald text-emerald-950 shadow-subtle'
                      : 'bg-white border-surface-border hover:border-slate-300 text-ink-primary hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-accent-emerald shrink-0 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold font-sans">Available Now (Next 72h)</div>
                      <div className="text-[11px] text-ink-secondary">Ready to review SOW and join a pod immediately</div>
                    </div>
                  </div>
                  {talentData.currentAvailability === 'AVAILABLE_NOW' && (
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                  )}
                </button>

                {/* Option 2: Available in 2 Weeks */}
                <button
                  onClick={() => handleUpdate('LIMITED')}
                  disabled={updating}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between ${
                    talentData.currentAvailability === 'LIMITED'
                      ? 'bg-accent-cobalt-light/60 border-accent-cobalt text-blue-950 shadow-subtle'
                      : 'bg-white border-surface-border hover:border-slate-300 text-ink-primary hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-accent-cobalt shrink-0" />
                    <div>
                      <div className="text-xs font-bold font-sans">Available in 2 Weeks</div>
                      <div className="text-[11px] text-ink-secondary">Currently wrapping up existing client commitments</div>
                    </div>
                  </div>
                  {talentData.currentAvailability === 'LIMITED' && (
                    <CheckCircle2 className="w-4 h-4 text-accent-cobalt shrink-0" />
                  )}
                </button>

                {/* Option 3: Currently Booked */}
                <button
                  onClick={() => handleUpdate('UNAVAILABLE')}
                  disabled={updating}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between ${
                    talentData.currentAvailability === 'UNAVAILABLE'
                      ? 'bg-surface-secondary border-slate-400 text-ink-primary shadow-subtle'
                      : 'bg-white border-surface-border hover:border-slate-300 text-ink-primary hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-ink-muted shrink-0" />
                    <div>
                      <div className="text-xs font-bold font-sans">Currently Booked</div>
                      <div className="text-[11px] text-ink-secondary">Fully occupied for the next 30+ days</div>
                    </div>
                  </div>
                  {talentData.currentAvailability === 'UNAVAILABLE' && (
                    <CheckCircle2 className="w-4 h-4 text-ink-muted shrink-0" />
                  )}
                </button>
              </div>

              <div className="pt-4 text-center">
                <Link
                  to="/login"
                  className="text-xs text-ink-secondary hover:text-ink-primary inline-flex items-center gap-1 font-mono transition-colors"
                >
                  <span>Go to full Talent Console sign-in</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

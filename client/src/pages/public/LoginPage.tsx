import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight, AlertCircle, Sparkles, User, Briefcase, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchDemoUser } = useAuth();

  const [email, setEmail] = useState('alex@openbench.io');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      navigate(res.redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoKey: any) => {
    setError(null);
    setLoading(true);
    try {
      const redirectUrl = await switchDemoUser(demoKey);
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
              ROLE-AWARE AUTHENTICATION
            </span>
            <h1 className="text-3xl font-extrabold text-ink-primary">
              Sign In to OpenBench Console
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Redirects automatically to your Admin, Talent Bench, or Client Portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
            {/* Quick Demo Switcher Pane (Left 2 cols) */}
            <div className="md:col-span-2 bg-surface-subtle p-6 border-b md:border-b-0 md:border-r border-surface-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>One-Click Demo Personas</span>
                </div>
                <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
                  Test the entire collective from any perspective with pre-seeded data:
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ADMIN')}
                    className="w-full p-2.5 rounded-xl bg-white border border-surface-border hover:border-purple-500 text-left transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary">Founder Alex (Admin)</div>
                      <div className="text-[10px] text-ink-muted font-mono">alex@openbench.io</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                      ADMIN
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('TALENT_US')}
                    className="w-full p-2.5 rounded-xl bg-white border border-surface-border hover:border-emerald-500 text-left transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary">Marcus Vance (US Dev)</div>
                      <div className="text-[10px] text-ink-muted font-mono">marcus.vance@gmail.com</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      TALENT
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('TALENT_UK')}
                    className="w-full p-2.5 rounded-xl bg-white border border-surface-border hover:border-blue-500 text-left transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary">Elena Rostova (UK UI)</div>
                      <div className="text-[10px] text-ink-muted font-mono">elena.rostova@designpod.co.uk</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-accent-cobalt font-bold border border-blue-200">
                      TALENT
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('CLIENT_US')}
                    className="w-full p-2.5 rounded-xl bg-white border border-surface-border hover:border-amber-500 text-left transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary">Sarah Connor (US Client)</div>
                      <div className="text-[10px] text-ink-muted font-mono">sarah.connor@apexscale.com</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                      CLIENT
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('CLIENT_IN')}
                    className="w-full p-2.5 rounded-xl bg-white border border-surface-border hover:border-amber-500 text-left transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary">Vikram Singh (IN Client)</div>
                      <div className="text-[10px] text-ink-muted font-mono">vikram.singh@zenithflow.in</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                      CLIENT
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-4 text-[11px] text-ink-muted border-t border-surface-border font-mono">
                Password for all seeded accounts: <strong className="text-ink-primary">Password123!</strong>
              </div>
            </div>

            {/* Standard Credentials Form (Right 3 cols) */}
            <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@openbench.io"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-ink-primary">Password</label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-accent-cobalt hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-border focus:border-accent-cobalt outline-none font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-sm hover:bg-accent-cobalt-hover shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Console'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-4 border-t border-surface-border text-center text-xs text-ink-secondary">
                  Don't have an account?{' '}
                  <Link to="/join" className="text-accent-cobalt font-semibold hover:underline">
                    Apply to Bench
                  </Link>{' '}
                  or{' '}
                  <Link to="/start-project" className="text-accent-cobalt font-semibold hover:underline">
                    Submit Project
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

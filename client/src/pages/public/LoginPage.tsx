import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, ArrowRight, AlertCircle, Sparkles, User, Briefcase, Lock, Check } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 space-y-2">
            <Badge variant="primary" dot pulse>
              ROLE-AWARE AUTHENTICATION
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary font-sans tracking-tight">
              Sign In to OpenBench Console
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Redirects automatically to your Admin, Talent Bench, or Client Portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 bg-white rounded-3xl border border-surface-border shadow-smooth overflow-hidden">
            {/* Quick Demo Switcher Pane (Left 2 cols) */}
            <div className="md:col-span-2 bg-surface-subtle/70 p-6 md:p-8 border-b md:border-b-0 md:border-r border-surface-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt mb-2">
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
                    className="w-full p-3 rounded-2xl bg-white border border-surface-border hover:border-accent-purple/50 hover:shadow-subtle text-left transition-all duration-150 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary group-hover:text-accent-purple transition-colors">
                        Alex (Founder Admin)
                      </div>
                      <div className="text-[10px] text-ink-muted font-mono">alex@openbench.io</div>
                    </div>
                    <Badge variant="purple" size="sm">ADMIN</Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('TALENT_US')}
                    className="w-full p-3 rounded-2xl bg-white border border-surface-border hover:border-accent-emerald/50 hover:shadow-subtle text-left transition-all duration-150 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary group-hover:text-accent-emerald transition-colors">
                        Marcus Vance (US Dev)
                      </div>
                      <div className="text-[10px] text-ink-muted font-mono">marcus.vance@gmail.com</div>
                    </div>
                    <Badge variant="success" size="sm">TALENT</Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('TALENT_UK')}
                    className="w-full p-3 rounded-2xl bg-white border border-surface-border hover:border-accent-cobalt/50 hover:shadow-subtle text-left transition-all duration-150 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary group-hover:text-accent-cobalt transition-colors">
                        Elena Rostova (UK UI)
                      </div>
                      <div className="text-[10px] text-ink-muted font-mono">elena.rostova@designpod.co.uk</div>
                    </div>
                    <Badge variant="primary" size="sm">POD</Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('CLIENT_US')}
                    className="w-full p-3 rounded-2xl bg-white border border-surface-border hover:border-slate-400 hover:shadow-subtle text-left transition-all duration-150 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary">Sarah Connor (US Client)</div>
                      <div className="text-[10px] text-ink-muted font-mono">sarah.connor@apexscale.com</div>
                    </div>
                    <Badge variant="secondary" size="sm">CLIENT</Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('CLIENT_IN')}
                    className="w-full p-3 rounded-2xl bg-white border border-surface-border hover:border-slate-400 hover:shadow-subtle text-left transition-all duration-150 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-primary">Vikram Singh (IN Client)</div>
                      <div className="text-[10px] text-ink-muted font-mono">vikram.singh@zenithflow.in</div>
                    </div>
                    <Badge variant="secondary" size="sm">CLIENT</Badge>
                  </button>
                </div>
              </div>

              <div className="pt-4 text-[11px] text-ink-muted border-t border-surface-border/80 font-mono mt-4">
                Default password: <strong className="text-ink-primary">Password123!</strong>
              </div>
            </div>

            {/* Standard Credentials Form (Right 3 cols) */}
            <div className="md:col-span-3 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-accent-rose-light border border-accent-rose-border flex items-start gap-2.5 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 text-accent-rose shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@openbench.io"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white text-ink-primary placeholder:text-ink-muted focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
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
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none font-mono transition-all shadow-subtle"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Console'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-4 border-t border-surface-border/80 text-center text-xs text-ink-secondary">
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

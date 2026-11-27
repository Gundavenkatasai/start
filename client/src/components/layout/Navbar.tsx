import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ChevronDown, User, LogOut, ArrowRight, Menu, X, Sparkles, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, role, logout, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleDemoSwitch = async (demoKey: any) => {
    setDemoMenuOpen(false);
    const redirectUrl = await switchDemoUser(demoKey);
    navigate(redirectUrl);
  };

  const getPortalLink = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'CLIENT') return '/client/dashboard';
    return '/talent/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-surface-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-accent-cobalt flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-accent-cobalt-hover transition-all">
              <span className="font-mono font-bold text-sm tracking-tight">OB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-ink-primary font-sans">
                Open<span className="text-accent-cobalt">Bench</span>
              </span>
              <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                Managed Talent
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-ink-secondary">
            <a
              href="/#verticals"
              className="px-3 py-1.5 rounded-xl hover:text-ink-primary hover:bg-surface-secondary/70 transition-all"
            >
              4 Launch Verticals
            </a>
            <a
              href="/#calculator"
              className="px-3 py-1.5 rounded-xl hover:text-ink-primary hover:bg-surface-secondary/70 transition-all"
            >
              Open-Book Math
            </a>
            <a
              href="/#workflow"
              className="px-3 py-1.5 rounded-xl hover:text-ink-primary hover:bg-surface-secondary/70 transition-all"
            >
              6-Stage Protocol
            </a>
            <a
              href="/#faq"
              className="px-3 py-1.5 rounded-xl hover:text-ink-primary hover:bg-surface-secondary/70 transition-all"
            >
              FAQ & Guarantees
            </a>
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-surface-subtle hover:bg-surface-secondary text-ink-secondary hover:text-ink-primary border border-surface-border transition-all shadow-subtle"
                title="Switch between seeded demo accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-cobalt" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-ink-muted" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-surface-border shadow-elevated p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                    Instant Persona Login:
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleDemoSwitch('ADMIN')}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-surface-secondary flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-ink-primary">Alex (Founder Admin)</div>
                        <div className="text-[10px] text-ink-muted font-mono">alex@openbench.io</div>
                      </div>
                      <Badge variant="purple" size="sm">ADMIN</Badge>
                    </button>
                    <button
                      onClick={() => handleDemoSwitch('TALENT_US')}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-surface-secondary flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-ink-primary">Marcus Vance (US Dev)</div>
                        <div className="text-[10px] text-ink-muted font-mono">Full-Stack Lead</div>
                      </div>
                      <Badge variant="success" size="sm">BENCH</Badge>
                    </button>
                    <button
                      onClick={() => handleDemoSwitch('TALENT_UK')}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-surface-secondary flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-ink-primary">Elena Rostova (UK UI)</div>
                        <div className="text-[10px] text-ink-muted font-mono">Design Systems</div>
                      </div>
                      <Badge variant="primary" size="sm">POD</Badge>
                    </button>
                    <button
                      onClick={() => handleDemoSwitch('CLIENT_US')}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-surface-secondary flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-ink-primary">Sarah Chen (Client)</div>
                        <div className="text-[10px] text-ink-muted font-mono">Venture Studio</div>
                      </div>
                      <Badge variant="secondary" size="sm">CLIENT</Badge>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getPortalLink()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border hover:bg-blue-100/70 transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Go to {role} Console</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-secondary border border-transparent transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/join"
                  className="px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary rounded-xl transition-all"
                >
                  Join Bench
                </Link>
                <Link
                  to="/start-project"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-cobalt text-white hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all flex items-center gap-1.5"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary border border-surface-border transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-white px-4 py-5 space-y-4 shadow-elevated animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            <a
              href="/#verticals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary"
            >
              4 Launch Verticals
            </a>
            <a
              href="/#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary"
            >
              Open-Book Math
            </a>
            <a
              href="/#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary"
            >
              6-Stage Protocol
            </a>
            <a
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary"
            >
              FAQ & Guarantees
            </a>
          </nav>

          <div className="pt-3 border-t border-surface-border space-y-2">
            <div className="text-[11px] font-mono font-semibold uppercase text-ink-muted px-2">
              Instant Demo Login:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoSwitch('ADMIN')}
                className="p-2 rounded-xl text-xs font-medium bg-surface-subtle border border-surface-border text-left hover:border-purple-300"
              >
                Founder Admin
              </button>
              <button
                onClick={() => handleDemoSwitch('TALENT_US')}
                className="p-2 rounded-xl text-xs font-medium bg-surface-subtle border border-surface-border text-left hover:border-emerald-300"
              >
                Bench Talent
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-border flex flex-col gap-2">
            {user ? (
              <Link
                to={getPortalLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-accent-cobalt text-white text-center shadow-sm"
              >
                Open {role} Console
              </Link>
            ) : (
              <>
                <Link
                  to="/start-project"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-accent-cobalt text-white text-center shadow-sm"
                >
                  Start a Project
                </Link>
                <Link
                  to="/join"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-surface-secondary text-ink-primary border border-surface-border text-center"
                >
                  Join the Talent Bench
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-xs font-medium text-ink-secondary text-center hover:text-ink-primary"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

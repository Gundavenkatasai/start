import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ChevronDown, User, LogOut, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-accent-cobalt flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-accent-cobalt-hover transition-colors">
              <span className="font-mono font-extrabold text-lg">OB</span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-ink-primary font-sans">
                Open<span className="text-accent-cobalt">Bench</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-accent-cobalt border border-blue-200">
                Managed Talent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-secondary">
            <a href="/#verticals" className="hover:text-ink-primary transition-colors">
              4 Verticals
            </a>
            <a href="/#calculator" className="hover:text-ink-primary transition-colors">
              Open-Book Math
            </a>
            <a href="/#workflow" className="hover:text-ink-primary transition-colors">
              6-Stage Delivery
            </a>
            <a href="/#faq" className="hover:text-ink-primary transition-colors">
              FAQ & Guarantees
            </a>
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-surface-secondary text-ink-secondary hover:text-ink-primary border border-surface-border transition-colors"
                title="Switch between seeded demo accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-cobalt" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-surface-border shadow-elevated p-1.5 z-50">
                  <div className="px-2 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                    Quick Role Login:
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('ADMIN')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-secondary flex items-center justify-between"
                  >
                    <span className="font-medium text-ink-primary">Founder Alex (Admin)</span>
                    <span className="text-[10px] font-mono px-1 bg-purple-50 text-purple-700 rounded">ADMIN</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('TALENT_US')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-secondary flex items-center justify-between"
                  >
                    <span className="font-medium text-ink-primary">Marcus Vance (US Dev)</span>
                    <span className="text-[10px] font-mono px-1 bg-emerald-50 text-emerald-700 rounded">BENCH</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('TALENT_UK')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-secondary flex items-center justify-between"
                  >
                    <span className="font-medium text-ink-primary">Elena Rostova (UK UI)</span>
                    <span className="text-[10px] font-mono px-1 bg-blue-50 text-blue-700 rounded">POD</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('CLIENT_US')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-secondary flex items-center justify-between"
                  >
                    <span className="font-medium text-ink-primary">Sarah Connor (US Client)</span>
                    <span className="text-[10px] font-mono px-1 bg-amber-50 text-amber-700 rounded">CLIENT</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('CLIENT_IN')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-secondary flex items-center justify-between"
                  >
                    <span className="font-medium text-ink-primary">Vikram Singh (IN Client)</span>
                    <span className="text-[10px] font-mono px-1 bg-amber-50 text-amber-700 rounded">CLIENT</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getPortalLink()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-accent-cobalt border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user.fullName.split(' ')[0]}'s Portal</span>
                  <span className="text-[10px] font-mono px-1 bg-white rounded border border-blue-300">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-ink-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/join"
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-surface-secondary text-ink-primary hover:bg-surface-border border border-surface-border transition-colors"
                >
                  Join Bench
                </Link>
                <Link
                  to="/start-project"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-accent-cobalt text-white hover:bg-accent-cobalt-hover shadow-sm transition-colors"
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
              className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-border space-y-3">
            <a
              href="/#verticals"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary"
            >
              4 Verticals
            </a>
            <a
              href="/#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary"
            >
              Open-Book Math
            </a>
            <a
              href="/#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary"
            >
              6-Stage Delivery
            </a>
            <div className="pt-2 border-t border-surface-border flex flex-col gap-2">
              {user ? (
                <Link
                  to={getPortalLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-xs font-semibold rounded-xl bg-accent-cobalt text-white"
                >
                  Go to {user.role} Portal
                </Link>
              ) : (
                <>
                  <Link
                    to="/start-project"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-xs font-semibold rounded-xl bg-accent-cobalt text-white"
                  >
                    Start a Project
                  </Link>
                  <Link
                    to="/join"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-xs font-semibold rounded-xl bg-surface-secondary text-ink-primary border border-surface-border"
                  >
                    Join the Talent Bench
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-xs font-semibold text-ink-secondary"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

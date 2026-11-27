import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  FileCheck,
  CreditCard,
  UserCheck,
  Briefcase,
  Sliders,
  DollarSign,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, logout, switchDemoUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleDemoSwitch = async (demoKey: any) => {
    setDemoMenuOpen(false);
    const redirectUrl = await switchDemoUser(demoKey);
    navigate(redirectUrl);
  };

  // Build navigation items based on role
  let navItems: { label: string; path: string; icon: any }[] = [];

  if (role === 'ADMIN') {
    navItems = [
      { label: 'Ops Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Talent Bench CRM', path: '/admin/talent', icon: Users },
      { label: 'Projects & Scoping', path: '/admin/projects', icon: FolderGit2 },
    ];
  } else if (role === 'TALENT') {
    navItems = [
      { label: 'Bench Dashboard', path: '/talent/dashboard', icon: LayoutDashboard },
      { label: 'Payouts & Ledger', path: '/talent/payouts', icon: DollarSign },
      { label: 'Bank & Tax Profile', path: '/talent/profile', icon: UserCheck },
    ];
  } else if (role === 'CLIENT') {
    navItems = [
      { label: 'Client Projects', path: '/client/dashboard', icon: Briefcase },
      { label: 'Submit New Brief', path: '/client/projects/new', icon: PlusCircle },
    ];
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-surface-border flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-surface-border/80">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-cobalt flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
                OB
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-ink-primary font-sans">
                  Open<span className="text-accent-cobalt">Bench</span>
                </span>
                <span className="block text-[9px] font-mono tracking-wider text-ink-muted uppercase">
                  {role} CONSOLE
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
              Workspace Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border/60 shadow-subtle'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cobalt' : 'text-ink-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Founder Lead Ops Card */}
          <div className="mx-4 mt-auto mb-4 p-4 rounded-2xl bg-surface-subtle/80 border border-surface-border">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-accent-cobalt" />
              <span className="text-xs font-bold text-ink-primary font-sans">Founder Ops Desk</span>
            </div>
            <p className="text-[11px] text-ink-secondary leading-relaxed mb-3">
              Direct access to Alex & Dev for project scoping, QA reviews, and milestone disbursements.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-accent-emerald font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                72h Kickoff SLA
              </span>
              <span className="text-ink-muted">ops@openbench.io</span>
            </div>
          </div>
        </div>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-4 border-t border-surface-border/80 bg-surface-subtle/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-accent-cobalt-light text-accent-cobalt border border-accent-cobalt-border flex items-center justify-center font-bold text-xs shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-ink-primary truncate font-sans">
                  {user?.fullName || 'User'}
                </div>
                <div className="text-[10px] font-mono text-ink-muted truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-ink-muted hover:text-accent-rose hover:bg-accent-rose-light/40 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-surface-border px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary border border-surface-border"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
              <span>OpenBench</span>
              <span>/</span>
              <span className="font-semibold text-ink-primary capitalize">
                {location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher inside Portal */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-surface-subtle hover:bg-surface-secondary text-ink-secondary hover:text-ink-primary border border-surface-border transition-all shadow-subtle"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-cobalt" />
                <span className="hidden sm:inline">Role: {role}</span>
                <span className="sm:hidden">{role}</span>
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-surface-border shadow-elevated p-2 z-50">
                  <div className="px-2.5 py-1 text-[11px] font-mono font-semibold uppercase text-ink-muted">
                    Switch Perspective:
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleDemoSwitch('ADMIN')}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl hover:bg-surface-secondary flex items-center justify-between"
                    >
                      <span className="font-medium text-ink-primary">Admin Alex</span>
                      <Badge variant="purple" size="sm">ADMIN</Badge>
                    </button>
                    <button
                      onClick={() => handleDemoSwitch('TALENT_US')}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl hover:bg-surface-secondary flex items-center justify-between"
                    >
                      <span className="font-medium text-ink-primary">Dev Marcus</span>
                      <Badge variant="success" size="sm">BENCH</Badge>
                    </button>
                    <button
                      onClick={() => handleDemoSwitch('CLIENT_US')}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl hover:bg-surface-secondary flex items-center justify-between"
                    >
                      <span className="font-medium text-ink-primary">Client Sarah</span>
                      <Badge variant="secondary" size="sm">CLIENT</Badge>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="text-xs font-mono text-ink-muted hover:text-ink-primary flex items-center gap-1 transition-colors"
              target="_blank"
            >
              <span className="hidden sm:inline">Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

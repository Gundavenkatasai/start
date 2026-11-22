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
} from 'lucide-react';

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
    <div className="min-h-screen bg-surface-subtle flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-surface-border flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-surface-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-cobalt flex items-center justify-center text-white font-mono font-bold text-sm">
                OB
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-ink-primary font-sans">
                  Open<span className="text-accent-cobalt">Bench</span>
                </span>
                <span className="block text-[9px] font-mono tracking-wider text-ink-muted uppercase">
                  {role} CONSOLE
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-ink-muted hover:text-ink-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-accent-cobalt border border-blue-200 shadow-sm'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cobalt' : 'text-ink-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Founder Ops Contact Card & User Widget */}
        <div className="p-4 border-t border-surface-border space-y-3">
          {/* 2-Person Founder Lead Card */}
          <div className="p-3 bg-surface-secondary/70 rounded-xl border border-surface-border">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-muted flex items-center justify-between">
              <span>FOUNDER OPS TEAM</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-1 text-xs font-semibold text-ink-primary">
              Alex Morgan & Priya Sharma
            </div>
            <div className="text-[11px] text-ink-secondary">Direct PM, Scoping & QA Gate</div>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {user?.fullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-ink-primary truncate">{user?.fullName}</div>
                <div className="text-[10px] text-ink-muted truncate font-mono">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-surface-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
              <span>{role}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <span className="text-ink-primary font-semibold capitalize">
                {location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-surface-secondary text-ink-secondary hover:text-ink-primary border border-surface-border transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-cobalt" />
                <span className="hidden sm:inline">Role Switcher</span>
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-surface-border shadow-elevated p-1.5 z-50">
                  <div className="px-2 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                    Quick Role Preview:
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
                    <span className="text-[10px] font-mono px-1 bg-emerald-50 text-emerald-700 rounded">TALENT</span>
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

            <Link
              to="/"
              className="text-xs font-mono text-ink-muted hover:text-ink-primary flex items-center gap-1"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

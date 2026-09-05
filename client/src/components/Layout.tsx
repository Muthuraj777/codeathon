import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Badge } from './ui/Badge';
import {
  BarChart3,
  User,
  Briefcase,
  Target,
  FileCheck,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Code2,
  ShieldCheck,
  Search,
  Bell,
  CheckCircle2,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Competency Gap Analyzer', path: '/skill-gap', icon: Target },
    { label: 'Job Roles & Benchmarks', path: '/jobs', icon: Briefcase },
    { label: 'Skills Directory', path: '/skills', icon: Code2 },
    { label: 'Applications', path: '/applications', icon: FileCheck },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'employee':
        return 'primary';
      case 'student':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row relative selection:bg-blue-500/20 selection:text-blue-900">
      {/* Soft Ambient Background Mesh */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[650px] bg-blob-blue pointer-events-none z-0 opacity-80" />
      <div className="fixed top-1/3 right-10 w-[550px] h-[550px] bg-blob-indigo pointer-events-none z-0 opacity-60" />
      <div className="fixed bottom-10 left-10 w-[450px] h-[450px] bg-blob-purple pointer-events-none z-0 opacity-40" />

      {/* Desktop Left Sidebar Navigation (21st.dev Style) */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200/80 sticky top-0 h-screen z-30 shadow-2xs select-none">
        <div className="p-5 flex flex-col space-y-6 flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition duration-200 shrink-0">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[#0F172A] group-hover:text-blue-600 transition">
                  Skill Gap Analyzer
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Enterprise Suite
              </span>
            </div>
          </div>

          {/* Search Bar Trigger */}
          <div
            onClick={() => navigate('/skills')}
            className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs text-slate-500 hover:border-slate-300 hover:text-slate-800 transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search skills...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-200 text-slate-500">
              ⌘K
            </kbd>
          </div>

          {/* Navigation Links Group */}
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider px-3 mb-2">
              Navigation Menu
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-[#2563EB] shadow-2xs border border-blue-200/90 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom User Card in Sidebar */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-2xs">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Notification Icon in Sidebar */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 bottom-full mb-2 w-72 bg-white backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200 p-4 text-[#0F172A] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-2.5">
                    <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" /> Notifications
                    </h4>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-mono border border-blue-200">
                      Live
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Engine Synced</p>
                        <p className="text-[11px] text-slate-500">Readiness calculated for target role benchmarks.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Badge variant={getRoleBadgeVariant(user?.role)} dot className="capitalize text-[10px] px-2 py-0.5">
              {user?.role || 'User'}
            </Badge>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar Layout (< lg Breakpoint) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 px-4 h-15 flex items-center justify-between shadow-2xs">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-[#0F172A]">Skill Gap Analyzer</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200/80 relative"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-15 z-30 bg-white/95 backdrop-blur-2xl border-b border-slate-200 p-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="flex items-center justify-between py-2 border-b border-slate-200 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500">{user?.email}</p>
              </div>
            </div>
            <Badge variant={getRoleBadgeVariant(user?.role)} dot className="capitalize text-[10px]">
              {user?.role}
            </Badge>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive ? 'bg-blue-50 text-[#2563EB] font-semibold border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition mt-2 cursor-pointer border border-rose-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 z-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* SaaS Footer */}
        <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 z-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#2563EB] flex items-center justify-center text-white text-[10px] font-extrabold">
                SG
              </div>
              <span className="font-semibold text-slate-700">Skill Gap Analyzer Platform</span>
            </div>
            <p className="text-slate-500 font-normal">
              Powered by AI Competency Engine &copy; 2026
            </p>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span className="hover:text-slate-900 transition cursor-pointer">Security</span>
              <span>&bull;</span>
              <span className="hover:text-slate-900 transition cursor-pointer">Status</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

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
  ChevronDown,
  Code2,
  Sparkles,
  ShieldCheck,
  Search,
  Bell,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col relative selection:bg-blue-500/20 selection:text-blue-900">
      {/* Soft Ambient Radial Background Blobs */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[650px] bg-blob-blue pointer-events-none z-0 opacity-80" />
      <div className="fixed top-1/3 right-10 w-[550px] h-[550px] bg-blob-indigo pointer-events-none z-0 opacity-60" />
      <div className="fixed bottom-10 left-10 w-[450px] h-[450px] bg-blob-purple pointer-events-none z-0 opacity-40" />

      {/* Floating Light Glass Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & SaaS Badge */}
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-9.5 h-9.5 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition duration-200">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-[#0F172A] group-hover:text-blue-600 transition">
                    Skill Gap Analyzer
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    <Sparkles className="w-2.5 h-2.5 text-blue-600" /> PRO v2.4
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Enterprise Competency Suite
                </span>
              </div>
            </div>

            {/* Desktop Navigation Pills */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80 backdrop-blur-md">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition duration-200 select-none ${
                      isActive
                        ? 'bg-white text-[#2563EB] shadow-xs border border-slate-200/90 font-semibold'
                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Quick Search Trigger */}
              <div
                onClick={() => navigate('/skills')}
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-white/90 border border-slate-200 rounded-xl text-xs text-slate-500 hover:border-slate-300 hover:text-slate-800 transition cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search catalog...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 rounded border border-slate-200 text-slate-500">
                  ⌘K
                </kbd>
              </div>

              {/* Notification Popover Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer relative shadow-2xs"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200 p-4 text-[#0F172A] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
                      <h4 className="text-xs font-semibold text-[#0F172A] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" /> System Activity
                      </h4>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-mono border border-blue-200">
                        Live Stream
                      </span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900">Competency Engine Synced</p>
                          <p className="text-[11px] text-slate-500">Match score updated for target role benchmarks.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900">New Gap Analysis Ready</p>
                          <p className="text-[11px] text-slate-500">Calculated overall readiness rating.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/90 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition focus:outline-none cursor-pointer shadow-2xs"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left leading-tight hidden xl:block">
                    <div className="text-xs font-semibold text-slate-900 max-w-[110px] truncate">{user?.name}</div>
                    <div className="text-[10px] text-slate-500 max-w-[110px] truncate">{user?.email}</div>
                  </div>
                  <Badge variant={getRoleBadgeVariant(user?.role)} dot className="capitalize text-[10px] py-0.5 px-2">
                    {user?.role || 'User'}
                  </Badge>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200 p-2 text-[#0F172A] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-3 border-b border-slate-200/80 mb-1 space-y-1">
                      <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <div className="pt-1 flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(user?.role)} className="capitalize text-[10px]">
                          {user?.role} Role Access
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      View &amp; Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between py-3 border-b border-slate-200/80 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">{user?.name}</div>
                  <div className="text-[11px] text-slate-500">{user?.email}</div>
                </div>
              </div>
              <Badge variant={getRoleBadgeVariant(user?.role)} dot className="capitalize text-[10px]">
                {user?.role}
              </Badge>
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition mt-4 cursor-pointer border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 z-10">
        <Outlet />
      </main>

      {/* SaaS Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 z-10">
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
  );
};

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blob-indigo pointer-events-none z-0 opacity-60" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-blob-purple pointer-events-none z-0 opacity-40" />
      <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-blob-cyan pointer-events-none z-0 opacity-30" />

      {/* Floating 21st.dev Glass Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/70 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & SaaS Badge */}
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/30 transition duration-200 border border-white/20">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-indigo-200 transition">
                    Skill Gap Analyzer
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono-code">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> PRO v2.4
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Competency Platform
                </span>
              </div>
            </div>

            {/* Desktop Navigation Bar */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition duration-200 select-none ${
                      isActive
                        ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80 font-semibold'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
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
              {/* Quick Search Shortcut Trigger */}
              <div
                onClick={() => navigate('/skills')}
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search catalog...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-950 rounded border border-zinc-800 text-zinc-500">
                  ⌘K
                </kbd>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#09090b]" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 p-4 text-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
                      <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-400" /> Notifications
                      </h4>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-mono">
                        Real-time
                      </span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-zinc-200">Competency Model Ready</p>
                          <p className="text-[11px] text-zinc-400">Match engine updated for target engineering roles.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition focus:outline-none cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner ring-1 ring-white/20">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left leading-tight hidden xl:block">
                    <div className="text-xs font-semibold text-zinc-100 max-w-[110px] truncate">{user?.name}</div>
                    <div className="text-[10px] text-zinc-400 max-w-[110px] truncate">{user?.email}</div>
                  </div>
                  <Badge variant={getRoleBadgeVariant(user?.role)} dot className="capitalize text-[10px] py-0.5 px-2">
                    {user?.role || 'User'}
                  </Badge>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 p-2 text-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-3 border-b border-zinc-800/80 mb-1 space-y-1">
                      <p className="text-xs font-semibold text-white">{user?.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
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
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      View &amp; Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between py-3 border-b border-zinc-800/80 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{user?.name}</div>
                  <div className="text-[11px] text-zinc-400">{user?.email}</div>
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
                    isActive ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700' : 'text-zinc-300 hover:bg-zinc-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition mt-4 cursor-pointer border border-rose-500/20"
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
      <footer className="border-t border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md py-6 text-center text-xs text-zinc-500 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-extrabold">
              SG
            </div>
            <span className="font-semibold text-zinc-300">Skill Gap Analyzer Platform</span>
          </div>
          <p className="text-zinc-400 font-normal">
            Powered by AI Competency Engine &copy; 2026
          </p>
          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span className="hover:text-zinc-200 transition cursor-pointer">Security</span>
            <span>&bull;</span>
            <span className="hover:text-zinc-200 transition cursor-pointer">Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

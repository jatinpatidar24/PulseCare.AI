import React, { useState } from 'react';
import { 
  Activity, 
  Stethoscope, 
  Calendar, 
  FileText, 
  HeartPulse, 
  Bot, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentTab, setCurrentTab, onOpenChat }) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'predict', label: 'Symptom Checker', icon: Sparkles, badge: 'ML' },
    { id: 'doctors', label: 'Find Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'Appointments', icon: Calendar, authRequired: true },
    { id: 'records', label: 'EHR Records', icon: FileText, authRequired: true },
    { id: 'vitals', label: 'Vitals', icon: HeartPulse, authRequired: true },
  ];

  if (user?.role === 'doctor') {
    navItems.push({ id: 'doctor-portal', label: 'Doctor Portal', icon: ShieldCheck });
  }

  const handleNavClick = (id, authRequired) => {
    if (authRequired && !isAuthenticated) {
      setCurrentTab('login');
    } else {
      setCurrentTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-700 bg-clip-text text-transparent tracking-tight">
                PulseCare<span className="text-teal-600">.AI</span>
              </span>
              <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase -mt-1 hidden sm:block">
                Clinical ML & Telehealth
              </p>
            </div>
          </div>

          {/* Desktop Nav - Perfectly centered & aligned */}
          <nav className="hidden xl:flex items-center space-x-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.authRequired)}
                  className={`h-9 flex items-center space-x-1.5 px-3 rounded-xl text-xs lg:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="leading-none">{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-teal-100 text-teal-800 tracking-wider leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Medium Desktop Nav (1024px to 1279px) with slightly more compact padding */}
          <nav className="hidden md:flex xl:hidden items-center space-x-0.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.authRequired)}
                  className={`h-9 flex items-center space-x-1 px-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="leading-none">{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1 py-0.5 text-[9px] font-extrabold uppercase rounded bg-teal-100 text-teal-800 leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons - Perfectly aligned on same horizontal baseline with identical h-9 */}
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            {/* AI Assistant button */}
            <button
              onClick={onOpenChat}
              className="h-9 flex items-center space-x-1.5 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer"
            >
              <Bot className="w-4 h-4 animate-pulse shrink-0" />
              <span className="leading-none">AI Triage Chat</span>
            </button>

            {/* Auth status buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="h-9 flex items-center space-x-2 px-2.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate leading-none">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-50 text-teal-700 uppercase leading-none">
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 capitalize">
                        Role: {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab('appointments');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Appointments</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('records');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Electronic Health Records</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('vitals');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                      <span>Vitals Monitoring</span>
                    </button>

                    {user.role === 'doctor' && (
                      <button
                        onClick={() => {
                          setCurrentTab('doctor-portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 flex items-center space-x-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                        <span>Doctor Portal</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        setCurrentTab('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="h-9 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center leading-none"
                >
                  Sign In
                </button>
                <button
                  onClick={() => demoLogin('patient')}
                  className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center leading-none"
                >
                  Demo Patient
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-1.5 md:hidden">
            <button
              onClick={onOpenChat}
              className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"
              title="AI Triage Chat"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.authRequired)}
                className={`w-full h-10 flex items-center justify-between px-3 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    setCurrentTab('home');
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentTab('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold border border-slate-200 rounded-xl text-slate-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    demoLogin('patient');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold bg-teal-600 text-white rounded-xl"
                >
                  Demo Patient
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

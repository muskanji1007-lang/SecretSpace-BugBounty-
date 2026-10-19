import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Lock, Mail, Eye, EyeOff, ArrowRight, UserCheck, Sun, Moon } from '../components/common/icons.jsx';

export default function LoginPage() {
  const { login, quickDemoLogin, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const [emailOrCode, setEmailOrCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme === 'dark';

  const validate = () => {
    const errs = {};
    if (!emailOrCode.trim()) {
      errs.emailOrCode = 'Please enter your student email or campus key';
    }
    if (!password) {
      errs.password = 'Please enter your password';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    try {
      const ok = await login({ emailOrCode, password });
      if (ok) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setIsLoading(true);
    try {
      await quickDemoLogin(role);
      navigate(role === 'admin' ? '/admin' : '/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 transition-colors">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all">
        {/* Top Header Bar with Theme Toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-surface text-deep border border-border">
            Campus Verification Gate
          </span>

          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl bg-surface/70 hover:bg-surface text-muted hover:text-deep transition cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
        </div>

        {/* Cute Mascot & Heading (Matching Screenshot) */}
        <div className="text-center space-y-2 mb-6">
          <div className="relative w-20 h-20 mx-auto select-none">
            {/* Soft layered glow */}
            <div
              className={`absolute inset-0 rounded-full blur-md ${
                isDark ? 'bg-primary/20' : 'bg-[#F9E5EB]'
              }`}
            />
            {/* Cute Ghost SVG */}
            <svg viewBox="0 0 160 180" className="w-20 h-20 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30 80C30 45 52 20 80 20C108 20 130 45 130 80V140C130 145 125 148 120 145C114 141 108 141 102 145C97 149 91 149 86 145C80 141 74 141 68 145C63 149 57 149 52 145C46 141 40 141 34 145C31 147 28 145 28 140V80Z"
                fill={isDark ? '#2D1720' : '#FFFDFD'}
                stroke={isDark ? '#501E30' : '#EADDE1'}
                strokeWidth="2"
              />
              <circle cx="68" cy="72" r="5" fill={isDark ? '#FFFDFD' : '#291B20'} />
              <circle cx="92" cy="72" r="5" fill={isDark ? '#FFFDFD' : '#291B20'} />
              <ellipse cx="60" cy="80" rx="4" ry="2" fill="#B83259" opacity="0.45" />
              <ellipse cx="100" cy="80" rx="4" ry="2" fill="#B83259" opacity="0.45" />
            </svg>
            <span className="absolute -top-1 -right-1 text-xs text-primary">♡</span>
          </div>

          <h2 className="text-2xl font-black text-deep tracking-tight">
            Secret<span className="text-primary">Space</span>
          </h2>
          <p className="text-xs text-muted max-w-xs mx-auto">
            Sign in to unlock your campus confessions, reactions & polls
          </p>
        </div>

        {/* 1-Click Test Demo Logins */}
        <div className="p-3.5 rounded-2xl bg-surface/60 border border-border space-y-2 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-deep">
            <UserCheck className="w-4 h-4 text-primary" />
            <span>1-Click Test Logins (Instant Access)</span>
          </div>
          <p className="text-[11px] text-muted">
            Click below to instantly open the dashboard without typing:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-deep hover:bg-surface transition shadow-2xs cursor-pointer text-center"
            >
              🎓 Student Login
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-deep hover:bg-surface transition shadow-2xs cursor-pointer text-center"
            >
              🛡️ Admin Login
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center mb-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-muted uppercase tracking-wider">
            Or Sign In With Email
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5">
              College Email or Key
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={emailOrCode}
                onChange={(e) => setEmailOrCode(e.target.value)}
                placeholder="student@university.edu"
                className={`w-full text-xs pl-10 pr-4 py-3 rounded-xl border bg-canvas focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-main placeholder:text-muted transition ${
                  errors.emailOrCode ? 'border-danger' : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {errors.emailOrCode && (
              <p className="text-[11px] text-danger mt-1 font-medium">{errors.emailOrCode}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-main uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-xs pl-10 pr-10 py-3 rounded-xl border bg-canvas focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-main placeholder:text-muted transition ${
                  errors.password ? 'border-danger' : 'border-border focus:border-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-muted hover:text-main cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-danger mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#B83259] to-[#982748] hover:from-[#982748] hover:to-[#B83259] text-white font-bold text-sm shadow-md shadow-[#B83259]/25 transition cursor-pointer"
          >
            <span>{isLoading ? 'Unlocking...' : 'Unlock Campus Feed'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-border mt-5">
          <p className="text-xs text-muted">
            New to SecretSpace?{' '}
            <Link to="/signup" className="font-bold text-primary hover:text-deep underline">
              Claim Your Free Alias
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

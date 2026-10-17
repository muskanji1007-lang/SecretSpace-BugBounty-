import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Sparkles, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from '../components/common/icons.jsx';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [emailOrCode, setEmailOrCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (!validate()) return;

    const ok = await login({ emailOrCode, password });
    if (ok) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-xl shadow-deep/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent text-white mx-auto flex items-center justify-center font-black shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-deep tracking-tight">
            Welcome to Secret<span className="text-primary">Space</span>
          </h2>
          <p className="text-xs text-muted">
            Sign in to access your anonymous campus feed
          </p>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface/50 border border-border text-xs text-deep">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-snug">
            Zero PII storage. Your real name and identity are never linked to your confessions or votes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5">
              College Email or Anonymous Key
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={emailOrCode}
                onChange={(e) => setEmailOrCode(e.target.value)}
                placeholder="student@university.edu or APEX-KEY"
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
              <span className="text-[11px] text-primary hover:text-deep hover:underline cursor-pointer">
                Forgot password?
              </span>
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
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-deep text-white font-semibold text-sm shadow-md shadow-primary/20 transition cursor-pointer"
          >
            <span>Enter Campus Secretly</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-muted">
            Don't have an anonymous key yet?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-deep">
              Claim Your Alias
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

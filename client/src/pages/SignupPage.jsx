import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../data/mockData.js';
import {
  Sparkles,
  Lock,
  RefreshCw,
  School,
  ArrowRight,
} from '../components/common/icons.jsx';

const ADJECTIVES = ['Silent', 'Phantom', 'Cosmic', 'Midnight', 'Sneaky', 'Caffeinated', 'Mystic'];
const NOUNS = ['Student', 'Fox', 'Owl', 'Raven', 'Coder', 'Ghost', 'Ninja'];

export default function SignupPage() {
  const { signup } = useApp();
  const navigate = useNavigate();

  const [pseudonym, setPseudonym] = useState('Phantom Student #419');
  const [campusCode, setCampusCode] = useState('APEX-CAMPUS-NORTH');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('ghost');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState({});

  const generateRandomAlias = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setPseudonym(`${adj} ${noun} #${num}`);
  };

  const validate = () => {
    const errs = {};
    if (!pseudonym.trim()) errs.pseudonym = 'Pseudonym is required';
    if (!campusCode.trim()) errs.campusCode = 'Campus affiliation code is required';
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!agreeTerms) errs.terms = 'You must honor the Campus Community Code';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const ok = await signup({ pseudonym, campusCode, password, avatar: selectedAvatar });
    if (ok) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-xl shadow-deep/5 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent text-white mx-auto flex items-center justify-center font-black shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-deep tracking-tight">
            Claim Your Alias
          </h2>
          <p className="text-xs text-muted">
            Join SecretSpace without ever revealing your real name
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5">
              Anonymous Campus Alias
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-border bg-canvas focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-main"
              />
              <button
                type="button"
                onClick={generateRandomAlias}
                className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface/80 text-deep cursor-pointer transition shrink-0"
                title="Generate another alias"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {errors.pseudonym && (
              <p className="text-[11px] text-danger mt-1">{errors.pseudonym}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-2">
              Choose Persona Avatar
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                    selectedAvatar === avatar.id
                      ? 'border-primary bg-surface ring-1 ring-primary text-deep font-semibold'
                      : 'border-border hover:border-primary/40 text-main bg-card'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border ${avatar.color}`}
                  >
                    {avatar.name.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[10px] truncate max-w-full font-medium">
                    {avatar.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5">
              Campus Affiliation Key
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              <input
                type="text"
                value={campusCode}
                onChange={(e) => setCampusCode(e.target.value)}
                placeholder="e.g. APEX-CAMPUS-NORTH"
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-border bg-canvas focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary text-main placeholder:text-muted"
              />
            </div>
            {errors.campusCode && (
              <p className="text-[11px] text-danger mt-1">{errors.campusCode}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5">
              Secret Passphrase (Min 6 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-border bg-canvas focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary text-main placeholder:text-muted"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-danger mt-1">{errors.password}</p>
            )}
          </div>

          <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            <span className="text-main leading-relaxed">
              I agree never to post personal identifying information, hate speech, or targeted harassment on SecretSpace.
            </span>
          </label>
          {errors.terms && (
            <p className="text-[11px] text-danger">{errors.terms}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-deep text-white font-semibold text-sm shadow-md shadow-primary/20 transition cursor-pointer"
          >
            <span>Create Anonymous Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-muted">
            Already have an alias?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-deep">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

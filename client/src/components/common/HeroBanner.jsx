import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Sparkles, ArrowRight, MessageSquare, Heart, BarChart3, ShieldCheck, Sun, Moon } from './icons.jsx';

export default function HeroBanner({ onOpenCreateModal }) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-8 transition-all duration-300 border mb-6 bento-card ${
        isDark
          ? 'bg-gradient-to-br from-[#12101B]/95 via-[#0E0C17]/90 to-[#0A0910] border-white/[0.08] text-white shadow-2xl shadow-black/60'
          : 'bg-gradient-to-br from-[#FFF5F7] via-[#FAF5F7] to-[#F5EBF0] border-[#EADDE1] text-[#18181B] shadow-sm'
      }`}
    >
      {/* Ambient Radial Spotlight Mesh */}
      <div
        className={`absolute -top-24 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-primary/20 opacity-80' : 'bg-primary/10 opacity-60'
        }`}
      />
      <div
        className={`absolute -bottom-20 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-purple-600/15 opacity-70' : 'bg-purple-300/30 opacity-40'
        }`}
      />

      {/* Top Controls: Live Pulse Badge & Theme Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border border-primary/30 bg-primary/10 text-primary backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="tracking-wide">CAMPUS PULSE • 100% ANONYMOUS</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          className={`tactile-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
            isDark
              ? 'bg-surface/80 hover:bg-surface border-white/[0.08] text-main hover:text-white'
              : 'bg-white hover:bg-surface border-border text-deep shadow-2xs'
          }`}
          title="Toggle between Light and Dark Mode"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-primary" />
              <span>Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Main Hero Content & Stylized Mascot */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-3.5 text-center md:text-left max-w-xl">
          <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight">
            {isDark ? (
              <>
                Speak freely. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
                  Zero identity. True campus pulse.
                </span>
              </>
            ) : (
              <>
                Speak freely. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#0F172A] via-primary to-primary-hover bg-clip-text text-transparent">
                  Zero identity. True campus pulse.
                </span>
              </>
            )}
          </h2>

          <p className={`text-xs sm:text-sm leading-relaxed max-w-md ${isDark ? 'text-muted' : 'text-muted'}`}>
            Share unfiltered confessions, debate hot polls, and discover secrets across your college with encrypted pseudonymity.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={onOpenCreateModal}
              className="tactile-btn shimmer-sheen inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition cursor-pointer"
            >
              <span>Drop a Secret Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mascot / Visual Badge */}
        <div className="relative shrink-0 flex items-center justify-center w-44 h-44 select-none">
          <div
            className={`absolute inset-0 rounded-full blur-2xl transform scale-95 transition-opacity ${
              isDark ? 'bg-primary/25 animate-pulse' : 'bg-primary/15'
            }`}
          />
          <div className="absolute inset-3 rounded-full border border-primary/20 backdrop-blur-xs" />

          <svg
            viewBox="0 0 160 180"
            className="w-32 h-32 relative z-10 transition-transform duration-500 hover:scale-105 drop-shadow-[0_10px_25px_rgba(244,63,94,0.3)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30 80C30 45 52 20 80 20C108 20 130 45 130 80V140C130 145 125 148 120 145C114 141 108 141 102 145C97 149 91 149 86 145C80 141 74 141 68 145C63 149 57 149 52 145C46 141 40 141 34 145C31 147 28 145 28 140V80Z"
              fill={isDark ? 'url(#cyberGhostDark)' : '#FFFFFF'}
              stroke={isDark ? '#F43F5E' : '#E4E4E7'}
              strokeWidth="2"
            />

            <circle cx="68" cy="72" r="5.5" fill={isDark ? '#09090B' : '#18181B'} />
            <circle cx="92" cy="72" r="5.5" fill={isDark ? '#09090B' : '#18181B'} />

            <ellipse cx="60" cy="80" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
            <ellipse cx="100" cy="80" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />

            <defs>
              <linearGradient id="cyberGhostDark" x1="80" y1="20" x2="80" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.7" stopColor="#FEE2E2" />
                <stop offset="1" stopColor="#FECDD3" />
              </linearGradient>
            </defs>
          </svg>

          <span
            className="absolute top-2 right-4 text-xs select-none animate-bounce text-primary"
            style={{ animationDuration: '3s' }}
          >
            ✧
          </span>
          <span className="absolute bottom-3 left-4 text-xs select-none text-primary">
            ✦
          </span>
        </div>
      </div>

      {/* Feature Bento Chips Bar */}
      <div className="mt-6 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold relative z-10">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface/50 border border-border/60 hover:border-primary/30 transition">
          <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">Encrypted Disguises</span>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface/50 border border-border/60 hover:border-primary/30 transition">
          <Heart className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">Campus Reactions</span>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface/50 border border-border/60 hover:border-primary/30 transition">
          <BarChart3 className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">Live Pulse Polls</span>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface/50 border border-border/60 hover:border-primary/30 transition">
          <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
          <span className="truncate">AI Mod Guard</span>
        </div>
      </div>
    </div>
  );
}

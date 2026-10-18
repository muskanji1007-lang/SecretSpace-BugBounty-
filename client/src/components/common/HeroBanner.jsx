import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Sparkles, ArrowRight, MessageSquare, Heart, BarChart3, ShieldCheck, Sun, Moon } from './icons.jsx';

export default function HeroBanner({ onOpenCreateModal }) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-300 border mb-6 ${
        isDark
          ? 'bg-gradient-to-br from-[#130E2E] via-[#18113B] to-[#0D0A22] border-[#2E245C] text-white shadow-xl shadow-purple-950/30'
          : 'bg-gradient-to-br from-[#FFF5FA] via-[#FAF5FF] to-[#F3E8FF] border-[#F1E3F8] text-[#1E122C] shadow-xs'
      }`}
    >
      {/* Subtle background glow bubbles */}
      <div
        className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-primary/20' : 'bg-pink-300/25'
        }`}
      />
      <div
        className={`absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
          isDark ? 'bg-accent/15' : 'bg-purple-200/30'
        }`}
      />

      {/* Top Controls: Mode Switcher Badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            isDark
              ? 'bg-[#1E1742] border-[#392B6E] text-purple-200'
              : 'bg-white/80 border-[#EBD6F5] text-deep'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>100% Anonymous Campus Space</span>
        </span>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
            isDark
              ? 'bg-[#1E1742] hover:bg-[#282057] border-[#392B6E] text-purple-200'
              : 'bg-white hover:bg-surface border-[#EBD6F5] text-deep shadow-2xs'
          }`}
          title="Toggle between Screenshot Light and Dark Palette"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-primary" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Hero Content & Ghost Mascot */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <h2
            className={`font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-deep'
            }`}
          >
            {isDark ? (
              <>
                Share what's <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-accent bg-clip-text text-transparent">
                  on your mind...
                </span>
              </>
            ) : (
              <>
                Your thoughts, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-deep via-primary to-accent bg-clip-text text-transparent">
                  Your space.
                </span>
              </>
            )}
          </h2>

          <p
            className={`text-xs sm:text-sm leading-relaxed max-w-md ${
              isDark ? 'text-purple-200/80' : 'text-muted'
            }`}
          >
            {isDark
              ? 'Anonymous thoughts. Real campus connections.'
              : 'Share confessions, opinions, experiences and more — completely anonymously.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-accent via-primary to-deep hover:opacity-95 shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{isDark ? 'Join Now' : 'Join Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cute Ghost Mascot Graphic (Matching User's Screenshot) */}
        <div className="relative shrink-0 flex items-center justify-center w-48 h-48 select-none">
          {/* Layered Organic Blob Backdrop for Light Mode */}
          {!isDark ? (
            <>
              <div className="absolute inset-0 bg-pink-200/50 rounded-full blur-md transform -rotate-6 scale-95" />
              <div className="absolute inset-2 bg-purple-200/60 rounded-full blur-sm transform rotate-12 scale-90" />
              <div className="absolute inset-4 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full shadow-inner" />
            </>
          ) : (
            <>
              {/* Glowing Nebula for Dark Mode */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl transform scale-100 animate-pulse" />
              <div className="absolute inset-3 bg-accent/20 rounded-full blur-md" />
            </>
          )}

          {/* Floating Ghost SVG */}
          <svg
            viewBox="0 0 160 180"
            className={`w-36 h-36 relative z-10 transition-transform duration-500 hover:scale-105 ${
              isDark ? 'drop-shadow-[0_10px_20px_rgba(168,85,247,0.4)]' : 'drop-shadow-md'
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ghost Body */}
            <path
              d="M30 80C30 45 52 20 80 20C108 20 130 45 130 80V140C130 145 125 148 120 145C114 141 108 141 102 145C97 149 91 149 86 145C80 141 74 141 68 145C63 149 57 149 52 145C46 141 40 141 34 145C31 147 28 145 28 140V80Z"
              fill={isDark ? 'url(#ghostDarkGrad)' : '#FFFFFF'}
            />

            {/* Ghost Eyes */}
            <circle cx="68" cy="72" r="5.5" fill={isDark ? '#120D2C' : '#1E122C'} />
            <circle cx="92" cy="72" r="5.5" fill={isDark ? '#120D2C' : '#1E122C'} />

            {/* Cute Cheeks */}
            <ellipse cx="60" cy="80" rx="4" ry="2" fill="#F472B6" opacity={isDark ? '0.7' : '0.5'} />
            <ellipse cx="100" cy="80" rx="4" ry="2" fill="#F472B6" opacity={isDark ? '0.7' : '0.5'} />

            {/* Gradients */}
            <defs>
              <linearGradient id="ghostDarkGrad" x1="80" y1="20" x2="80" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5EEFF" />
                <stop offset="0.6" stopColor="#E9D5FF" />
                <stop offset="1" stopColor="#D8B4FE" />
              </linearGradient>
            </defs>
          </svg>

          {/* Cute Floating Heart & Sparkle Doodles from Screenshot */}
          <span
            className={`absolute top-2 right-4 text-xs select-none animate-bounce ${
              isDark ? 'text-pink-300' : 'text-accent'
            }`}
            style={{ animationDuration: '3s' }}
          >
            ♡
          </span>
          <span
            className={`absolute bottom-3 left-4 text-sm select-none ${
              isDark ? 'text-purple-300' : 'text-primary'
            }`}
          >
            ♡
          </span>
          <span
            className={`absolute top-8 left-2 text-[10px] select-none ${
              isDark ? 'text-amber-200' : 'text-pink-400'
            }`}
          >
            ✧
          </span>
        </div>
      </div>

      {/* Feature Badges Bar (From Screenshot bottom row) */}
      <div
        className={`mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold relative z-10 ${
          isDark ? 'border-[#2E245C]' : 'border-[#F1E3F8]'
        }`}
      >
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#181138] text-purple-200' : 'bg-white/80 text-deep border border-[#F1E3F8]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">Anonymous Posts</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#181138] text-purple-200' : 'bg-white/80 text-deep border border-[#F1E3F8]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate">Reactions & Comments</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#181138] text-purple-200' : 'bg-white/80 text-deep border border-[#F1E3F8]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="truncate">Campus Polls</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#181138] text-purple-200' : 'bg-white/80 text-deep border border-[#F1E3F8]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">Report & Stay Safe</span>
        </div>
      </div>
    </div>
  );
}

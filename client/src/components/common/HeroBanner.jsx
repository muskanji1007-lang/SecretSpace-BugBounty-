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
          ? 'bg-gradient-to-br from-[#211116] via-[#2A151D] to-[#150B0E] border-[#38202A] text-white shadow-xl shadow-[#211116]/40'
          : 'bg-gradient-to-br from-[#FFF4F5] via-[#F8F3F4] to-[#F9E5EB] border-[#EADDE1] text-[#291B20] shadow-xs'
      }`}
    >
      {/* Subtle Cherry background glow bubbles */}
      <div
        className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-[#B83259]/15' : 'bg-[#F9E5EB]/70'
        }`}
      />
      <div
        className={`absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
          isDark ? 'bg-[#501E30]/25' : 'bg-[#FFF4F5]/80'
        }`}
      />

      {/* Top Controls: Mode Switcher Badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            isDark
              ? 'bg-[#2A151D] border-[#38202A] text-[#F9E5EB]'
              : 'bg-white/90 border-[#EADDE1] text-deep'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>100% Anonymous Campus Space</span>
        </span>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
            isDark
              ? 'bg-[#2A151D] hover:bg-[#38202A] border-[#38202A] text-[#F9E5EB]'
              : 'bg-white hover:bg-surface border-[#EADDE1] text-deep shadow-2xs'
          }`}
          title="Toggle between Light and Dark Mode"
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
                <span className="bg-gradient-to-r from-[#FFFDFD] via-[#F9E5EB] to-[#B83259] bg-clip-text text-transparent">
                  on your mind...
                </span>
              </>
            ) : (
              <>
                Your thoughts, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-deep via-primary to-primary-hover bg-clip-text text-transparent">
                  Your space.
                </span>
              </>
            )}
          </h2>

          <p
            className={`text-xs sm:text-sm leading-relaxed max-w-md ${
              isDark ? 'text-[#D4B8C1]' : 'text-muted'
            }`}
          >
            {isDark
              ? 'Anonymous thoughts. Real campus connections.'
              : 'Share confessions, opinions, experiences and more — completely anonymously.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#B83259] via-[#982748] to-[#501E30] hover:opacity-95 shadow-lg shadow-[#B83259]/25 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cute Mascot Graphic with Cherry Noir Accents */}
        <div className="relative shrink-0 flex items-center justify-center w-48 h-48 select-none">
          {!isDark ? (
            <>
              <div className="absolute inset-0 bg-[#F9E5EB]/60 rounded-full blur-md transform -rotate-6 scale-95" />
              <div className="absolute inset-2 bg-[#FFF4F5]/80 rounded-full blur-sm transform rotate-12 scale-90" />
              <div className="absolute inset-4 bg-gradient-to-tr from-[#FFF4F5] to-[#F9E5EB] rounded-full shadow-inner" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[#B83259]/20 rounded-full blur-xl transform scale-100 animate-pulse" />
              <div className="absolute inset-3 bg-[#501E30]/30 rounded-full blur-md" />
            </>
          )}

          {/* Floating Ghost SVG */}
          <svg
            viewBox="0 0 160 180"
            className={`w-36 h-36 relative z-10 transition-transform duration-500 hover:scale-105 ${
              isDark ? 'drop-shadow-[0_10px_20px_rgba(184,50,89,0.35)]' : 'drop-shadow-md'
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ghost Body */}
            <path
              d="M30 80C30 45 52 20 80 20C108 20 130 45 130 80V140C130 145 125 148 120 145C114 141 108 141 102 145C97 149 91 149 86 145C80 141 74 141 68 145C63 149 57 149 52 145C46 141 40 141 34 145C31 147 28 145 28 140V80Z"
              fill={isDark ? 'url(#ghostDarkGrad)' : '#FFFDFD'}
              stroke={isDark ? '#501E30' : '#EADDE1'}
              strokeWidth="2"
            />

            {/* Ghost Eyes */}
            <circle cx="68" cy="72" r="5.5" fill="#291B20" />
            <circle cx="92" cy="72" r="5.5" fill="#291B20" />

            {/* Cute Cheeks */}
            <ellipse cx="60" cy="80" rx="4" ry="2" fill="#B83259" opacity="0.45" />
            <ellipse cx="100" cy="80" rx="4" ry="2" fill="#B83259" opacity="0.45" />

            {/* Gradients */}
            <defs>
              <linearGradient id="ghostDarkGrad" x1="80" y1="20" x2="80" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFDFD" />
                <stop offset="0.6" stopColor="#F9E5EB" />
                <stop offset="1" stopColor="#EADDE1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Cute Floating Hearts in Cherry Red */}
          <span
            className="absolute top-2 right-4 text-xs select-none animate-bounce text-primary"
            style={{ animationDuration: '3s' }}
          >
            ♡
          </span>
          <span className="absolute bottom-3 left-4 text-sm select-none text-deep">
            ♡
          </span>
          <span className="absolute top-8 left-2 text-[10px] select-none text-primary">
            ✧
          </span>
        </div>
      </div>

      {/* Feature Badges Bar */}
      <div
        className={`mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold relative z-10 ${
          isDark ? 'border-[#38202A]' : 'border-[#EADDE1]'
        }`}
      >
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#2A151D] text-[#F9E5EB]' : 'bg-white/80 text-deep border border-[#EADDE1]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">Anonymous Posts</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#2A151D] text-[#F9E5EB]' : 'bg-white/80 text-deep border border-[#EADDE1]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">Reactions & Comments</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#2A151D] text-[#F9E5EB]' : 'bg-white/80 text-deep border border-[#EADDE1]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-deep shrink-0" />
          <span className="truncate">Campus Polls</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
            isDark ? 'bg-[#2A151D] text-[#F9E5EB]' : 'bg-white/80 text-deep border border-[#EADDE1]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
          <span className="truncate">Report & Stay Safe</span>
        </div>
      </div>
    </div>
  );
}

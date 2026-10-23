import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../../data/mockData.js';
import { Sparkles, Search, PlusCircle, Sun, Moon, LogOut, Menu } from '../common/icons.jsx';

export default function Navbar({ onOpenCreateModal, onToggleMobileMenu }) {
  const { user, isLoggedIn, logout, searchQuery, setSearchQuery, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const avatarObj =
    AVATAR_OPTIONS.find((a) => a.id === user?.avatar) || AVATAR_OPTIONS[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-2xl border-b border-border/80 px-3 sm:px-4 py-2.5 transition-colors shadow-xs relative">
      {/* BonkersUI Specular Top Light Beam */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand / Logo + Mobile Menu Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="tactile-btn md:hidden p-1.5 sm:p-2 rounded-xl bg-surface/70 hover:bg-surface text-muted hover:text-white border border-border/60 transition cursor-pointer"
            aria-label="Toggle navigation drawer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-main" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white flex items-center justify-center font-black shadow-md shadow-rose-500/25 ring-1 ring-white/20 group-hover:scale-105 transition duration-200">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base text-deep tracking-tight">
              Secret<span className="text-primary bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Space</span>
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/explore', label: 'Explore' },
            { to: '/polls', label: 'Polls' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `tactile-btn relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full bg-primary shadow-[0_0_8px_#F43F5E] transition-all duration-300 ${
                      isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 -ml-2'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-sm relative hidden sm:block"
        >
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search secrets, tags..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-surface/50 border border-border text-main placeholder:text-muted focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </form>

        {/* Right Actions: Theme Toggle, Post Button, Auth / Profile */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            className="tactile-btn p-2 rounded-xl bg-surface/70 hover:bg-surface border border-border/60 text-muted hover:text-deep transition cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          <button
            onClick={onOpenCreateModal}
            className="tactile-btn shimmer-sheen flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/30 hover:shadow-rose-600/50 hover:brightness-110 transition cursor-pointer shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Drop Secret</span>
            <span className="sm:hidden">Post</span>
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/profile"
                className={`tactile-btn w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${avatarObj.color} hover:ring-2 hover:ring-primary/40 transition`}
                title={`Logged in as ${user?.pseudonym || 'Anonymous'}`}
              >
                {avatarObj.name.substring(0, 2).toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className="tactile-btn p-2 rounded-xl hover:bg-surface hover:text-danger text-muted transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="tactile-btn shimmer-sheen px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 shadow-md shadow-rose-600/20 hover:brightness-110 transition cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

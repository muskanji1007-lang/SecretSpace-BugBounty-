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
    <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-xl border-b border-border px-3 sm:px-4 py-2.5 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand / Logo + Mobile Menu Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 sm:p-2 rounded-xl bg-surface/70 hover:bg-surface text-muted hover:text-deep border border-border/60 transition cursor-pointer"
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

        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? 'text-white bg-primary shadow-xs shadow-primary/25 font-bold'
                  : 'text-muted hover:text-deep hover:bg-surface/60'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? 'text-white bg-primary shadow-xs shadow-primary/25 font-bold'
                  : 'text-muted hover:text-deep hover:bg-surface/60'
              }`
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/polls"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? 'text-white bg-primary shadow-xs shadow-primary/25 font-bold'
                  : 'text-muted hover:text-deep hover:bg-surface/60'
              }`
            }
          >
            Polls
          </NavLink>
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
            className="p-2 rounded-xl bg-surface/70 hover:bg-surface border border-border/60 text-muted hover:text-deep transition cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/25 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Drop Secret</span>
            <span className="sm:hidden">Post</span>
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/profile"
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${avatarObj.color} hover:ring-2 hover:ring-primary/40 transition`}
                title={`Logged in as ${user?.pseudonym || 'Anonymous'}`}
              >
                {avatarObj.name.substring(0, 2).toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-xl hover:bg-surface hover:text-danger text-muted transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 shadow-md shadow-rose-600/20 hover:opacity-95 transition cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

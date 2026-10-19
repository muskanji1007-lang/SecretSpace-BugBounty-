import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../../data/mockData.js';
import { Sparkles, Search, PlusCircle, Sun, Moon, LogOut } from '../common/icons.jsx';

export default function Navbar({ onOpenCreateModal }) {
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
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B83259] to-[#982748] text-white flex items-center justify-center font-black shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base text-deep tracking-tight">
            Secret<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Quick Nav Links (Matching Screenshot Header: Home, Explore, Polls) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition ${
                isActive ? 'text-primary bg-surface/70 font-bold' : 'text-muted hover:text-deep hover:bg-surface/40'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition ${
                isActive ? 'text-primary bg-surface/70 font-bold' : 'text-muted hover:text-deep hover:bg-surface/40'
              }`
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/polls"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition ${
                isActive ? 'text-primary bg-surface/70 font-bold' : 'text-muted hover:text-deep hover:bg-surface/40'
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
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-canvas border border-border text-main placeholder:text-muted focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </form>

        {/* Right Actions: Theme Toggle, Post Button, Auth / Profile */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl bg-surface/60 hover:bg-surface text-muted hover:text-deep transition cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B83259] to-[#982748] hover:from-[#982748] hover:to-[#B83259] text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Drop Secret</span>
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
              className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#B83259] to-[#982748] hover:from-[#982748] hover:to-[#B83259] shadow-xs transition cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

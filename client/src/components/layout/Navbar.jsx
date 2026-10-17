import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../../data/mockData.js';
import { Sparkles, Search, PlusCircle } from '../common/icons.jsx';

export default function Navbar({ onOpenCreateModal }) {
  const { user, searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();

  const avatarObj =
    AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Mobile Brand */}
        <Link to="/" className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-black shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base text-deep tracking-tight">
            Secret<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md relative hidden sm:block"
        >
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search secrets, confessions, hashtags..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-canvas border border-border text-main placeholder:text-muted focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-deep text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Drop</span>
          </button>

          <Link
            to="/profile"
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${avatarObj.color} hover:ring-2 hover:ring-primary/40 transition`}
            title="My Profile"
          >
            {avatarObj.name.substring(0, 2).toUpperCase()}
          </Link>
        </div>
      </div>
    </header>
  );
}

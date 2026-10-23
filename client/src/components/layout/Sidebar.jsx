import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../../data/mockData.js';
import {
  Flame,
  Compass,
  Vote,
  Bookmark,
  Activity,
  User,
  Settings,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  X,
} from '../common/icons.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Feed', icon: Flame },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/polls', label: 'Campus Polls', icon: Vote },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/my-activity', label: 'My Activity', icon: Activity },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/admin', label: 'Moderation', icon: ShieldCheck, badge: 'Mod' },
];

export default function Sidebar({
  onOpenCreateModal,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) {
  const { user, bookmarkedPosts, reports } = useApp();
  const avatarObj =
    AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const handleLinkClick = () => {
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const handleCreateClick = () => {
    onOpenCreateModal();
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileDrawer && (
        <div
          onClick={onCloseMobileDrawer}
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      <aside
        className={`${
          isMobileDrawer
            ? 'md:hidden fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col justify-between p-4 border-r border-sidebar-border bg-sidebar-bg/95 backdrop-blur-xl text-sidebar-muted select-none overflow-y-auto'
            : 'w-64 shrink-0 hidden md:flex flex-col justify-between sticky top-0 h-screen p-4 border-r border-sidebar-border bg-sidebar-bg/95 backdrop-blur-xl text-sidebar-muted select-none'
        }`}
      >
        <div>
          <div className="flex items-center justify-between px-2 py-2 mb-5">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white flex items-center justify-center font-black shadow-md shadow-rose-600/25 ring-1 ring-white/20 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight leading-none group-hover:text-white/90 transition">
                  Secret<span className="text-primary bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Space</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-sidebar-muted">
                  Anonymous Campus
                </span>
              </div>
            </Link>

            {isMobileDrawer && (
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-xl bg-sidebar-hover hover:bg-sidebar-active text-sidebar-muted hover:text-white transition cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        <nav className="space-y-1">
          {NAV_ITEMS.filter((item) => item.badge !== 'Mod' || user?.role === 'admin').map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `tactile-btn flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer group ${
                    isActive
                      ? 'bg-primary/20 text-white border border-primary/35 shadow-xs font-semibold'
                      : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition ${
                          isActive ? 'text-primary' : 'text-sidebar-muted group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.label === 'Bookmarks' && bookmarkedPosts.length > 0 && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-sidebar-hover text-sidebar-muted'
                        }`}
                      >
                        {bookmarkedPosts.length}
                      </span>
                    )}

                    {item.badge === 'Mod' && pendingReportsCount > 0 && (
                      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-danger text-white">
                        {pendingReportsCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 px-1">
          <button
            onClick={handleCreateClick}
            className="tactile-btn shimmer-sheen w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-600/30 hover:shadow-rose-600/50 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Drop a Secret</span>
          </button>
        </div>
      </div>

      <Link
        to="/profile"
        onClick={handleLinkClick}
        className="tactile-btn flex items-center gap-3 p-3 rounded-xl border border-sidebar-border bg-sidebar-hover/40 hover:bg-sidebar-hover hover:border-primary/40 transition mt-4"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border border-primary/40 bg-primary/20 text-white shrink-0"
        >
          {avatarObj.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-xs text-white truncate">
            {user.pseudonym}
          </div>
          <div className="text-[11px] text-sidebar-muted truncate">{user.college}</div>
        </div>
      </Link>
    </aside>
  </>
);
}

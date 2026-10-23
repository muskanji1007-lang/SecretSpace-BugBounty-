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
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      {/* BonkersUI-Style Floating Curved Capsule Dock */}
      <aside
        className={`${
          isMobileDrawer
            ? 'md:hidden fixed top-3 bottom-3 left-3 z-50 w-72 max-w-[85vw] animate-in slide-in-from-left duration-200 select-none'
            : 'w-64 shrink-0 hidden md:block sticky top-3 h-[calc(100vh-1.5rem)] my-2 select-none z-20'
        }`}
      >
        {/* BonkersUI Outer Specular Gradient Glow Shell */}
        <div className="relative h-full rounded-[28px] p-px transition-all duration-500 ease-out bg-[linear-gradient(135deg,rgba(244,63,94,0.45),rgba(255,255,255,0.08)_30%,rgba(255,255,255,0.06)_70%,rgba(244,63,94,0.3))] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85),0_0_35px_-16px_rgba(244,63,94,0.4)]">
          {/* Inner Deep Glass Backdrop */}
          <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-[27px] p-3.5 backdrop-blur-2xl bg-[#08090E]/90 border border-white/[0.04]">
            {/* Top Specular Light Beam Highlight */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />

            <div>
              {/* Brand Header with Interactive Rotating Emblem on Hover */}
              <div className="flex items-center justify-between px-2 pt-1 pb-3 mb-2 border-b border-white/[0.06]">
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2.5 group"
                >
                  <div className="w-9 h-9 rounded-2xl bg-[#16060c] border border-rose-500/30 text-white flex items-center justify-center font-black shadow-[0_0_18px_rgba(244,63,94,0.3),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-transform duration-500 group-hover:rotate-45">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-extrabold text-base text-white tracking-tight leading-none group-hover:text-white/90 transition">
                      Secret<span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Space</span>
                    </h1>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                      Anonymous Campus
                    </span>
                  </div>
                </Link>

                {isMobileDrawer && (
                  <button
                    type="button"
                    onClick={onCloseMobileDrawer}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/10"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* BonkersUI Glass Pill Navigation Items with Glowing Active Indicator */}
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
                        `tactile-btn relative flex items-center justify-between px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer group ${
                          isActive
                            ? 'bg-white/[0.08] text-white border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.3)] font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5">
                            {/* BonkersUI Signature Glowing Active Indicator Dot */}
                            <span
                              aria-hidden="true"
                              className={`size-1.5 rounded-full bg-primary shadow-[0_0_8px_#F43F5E] transition-all duration-300 ${
                                isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 -ml-2'
                              }`}
                            />
                            <Icon
                              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                                isActive ? 'text-primary' : 'text-slate-400 group-hover:text-white'
                              }`}
                            />
                            <span className="tracking-tight">{item.label}</span>
                          </div>

                          {item.label === 'Bookmarks' && bookmarkedPosts.length > 0 && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-primary text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                                  : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              {bookmarkedPosts.length}
                            </span>
                          )}

                          {item.badge === 'Mod' && pendingReportsCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-danger text-white">
                              {pendingReportsCount}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* BonkersUI Gradient Pill CTA Button */}
              <div className="mt-4 px-1">
                <button
                  onClick={handleCreateClick}
                  className="tactile-btn group relative w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[linear-gradient(135deg,#e11d48,#9f1239)] ring-1 ring-rose-400/50 text-white font-bold text-xs shadow-[0_0_22px_-6px_rgba(244,63,94,0.7),inset_0_1px_0_rgba(255,255,255,0.18)] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer overflow-hidden"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/25 blur-xs transition-[left] duration-700 ease-out group-hover:left-[150%]"
                  />
                  <PlusCircle className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Drop a Secret</span>
                </button>
              </div>
            </div>

            {/* BonkersUI Bottom Profile Pill Capsule */}
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="tactile-btn flex items-center gap-2.5 p-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-primary/40 transition mt-3"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border border-rose-400/40 bg-rose-500/15 text-white shrink-0 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                {avatarObj.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-white truncate">
                  {user.pseudonym}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{user.college}</div>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

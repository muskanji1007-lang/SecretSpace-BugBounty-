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

export default function Sidebar({ onOpenCreateModal }) {
  const { user, bookmarkedPosts, reports } = useApp();
  const avatarObj =
    AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between sticky top-0 h-screen p-4 border-r border-[#38202A] bg-[#211116] text-[#D4B8C1] select-none">
      <div>
        <Link to="/" className="flex items-center gap-2.5 px-3 py-3 mb-6 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B83259] to-[#982748] text-white flex items-center justify-center font-black shadow-md shadow-[#B83259]/20 group-hover:opacity-95 transition">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight leading-none group-hover:text-white/90 transition">
              Secret<span className="text-[#B83259]">Space</span>
            </h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#D4B8C1]">
              Anonymous Campus
            </span>
          </div>
        </Link>

        <nav className="space-y-1">
          {NAV_ITEMS.filter((item) => item.badge !== 'Mod' || user?.role === 'admin').map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer group ${
                    isActive
                      ? 'bg-[#501E30] text-white shadow-sm font-semibold'
                      : 'text-[#D4B8C1] hover:bg-[#38202A] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition ${
                          isActive ? 'text-white' : 'text-[#D4B8C1] group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.label === 'Bookmarks' && bookmarkedPosts.length > 0 && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#38202A] text-[#F9E5EB]'
                        }`}
                      >
                        {bookmarkedPosts.length}
                      </span>
                    )}

                    {item.badge === 'Mod' && pendingReportsCount > 0 && (
                      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[#B42338] text-white">
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
            onClick={onOpenCreateModal}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#B83259] to-[#982748] hover:from-[#982748] hover:to-[#B83259] text-white font-semibold text-sm shadow-md shadow-[#B83259]/25 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Drop a Secret</span>
          </button>
        </div>
      </div>

      <Link
        to="/profile"
        className="flex items-center gap-3 p-3 rounded-xl border border-[#38202A] bg-[#2A151D] hover:bg-[#38202A] transition"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border border-[#501E30] bg-[#501E30] text-white shrink-0"
        >
          {avatarObj.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-xs text-white truncate">
            {user.pseudonym}
          </div>
          <div className="text-[11px] text-[#D4B8C1] truncate">{user.college}</div>
        </div>
      </Link>
    </aside>
  );
}

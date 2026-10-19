import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Compass, Vote, Bookmark, User } from '../common/icons.jsx';

const MOBILE_NAV_ITEMS = [
  { to: '/', label: 'Feed', icon: Flame },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/polls', label: 'Polls', icon: Vote },
  { to: '/bookmarks', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'You', icon: User },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#211116]/95 backdrop-blur-md border-t border-[#38202A] flex items-center justify-around py-2 px-1 safe-area-pb">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-1.5 rounded-xl transition cursor-pointer ${
                isActive ? 'text-white font-semibold' : 'text-[#D4B8C1] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg transition ${isActive ? 'bg-[#501E30]' : ''}`}>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white stroke-[2.5]' : 'text-[#D4B8C1]'
                    }`}
                  />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

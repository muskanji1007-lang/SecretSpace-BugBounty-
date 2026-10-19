import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  Settings,
  Bell,
  Shield,
  LogOut,
  AlertTriangle,
} from '../components/common/icons.jsx';

export default function SettingsPage() {
  const { logout, addToast, settings, updateSettings, resetInMemoryState } = useApp();

  const notifications = settings?.notifications || {
    upvotes: true,
    comments: true,
    polls: true,
    trendingAlerts: false,
  };

  const [privacy, setPrivacy] = useState({
    scrambleWeekly: true,
    hideHostelWing: false,
    blurSensitive: true,
  });

  const handleToggleNotif = (key) => {
    updateSettings({
      notifications: {
        ...notifications,
        [key]: !notifications[key],
      },
    });
    addToast('Notification preference updated & saved', 'info');
  };

  const handleTogglePrivacy = (key) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    addToast('Privacy shield setting adjusted', 'success');
  };

  const handleResetSession = () => {
    resetInMemoryState();
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface text-deep flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-deep text-base">Campus Settings</h2>
          <p className="text-xs text-muted">
            Control your privacy shields, notification alerts, and campus filters
          </p>
        </div>
      </div>

      {/* Privacy & Anonymity Shields */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-deep">
            Anonymity Shields
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-canvas cursor-pointer transition">
            <div>
              <div className="text-xs font-semibold text-main">
                Weekly Alias Scrambling
              </div>
              <div className="text-[11px] text-muted">
                Automatically generate a new anonymous pseudonym every 7 days to prevent pattern tracking
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacy.scrambleWeekly}
              onChange={() => handleTogglePrivacy('scrambleWeekly')}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-canvas cursor-pointer transition">
            <div>
              <div className="text-xs font-semibold text-main">
                Hide Campus Sub-Location
              </div>
              <div className="text-[11px] text-muted">
                Omit specific hostel block / wing tags from appearing on your secrets
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacy.hideHostelWing}
              onChange={() => handleTogglePrivacy('hideHostelWing')}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-canvas cursor-pointer transition">
            <div>
              <div className="text-xs font-semibold text-main">
                Sensitive Content Warning
              </div>
              <div className="text-[11px] text-muted">
                Blur posts flagged for exams distress or harsh confessions until clicked
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacy.blurSensitive}
              onChange={() => handleTogglePrivacy('blurSensitive')}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-deep">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-canvas cursor-pointer transition">
            <div>
              <div className="text-xs font-semibold text-main">
                Secret Upvotes
              </div>
              <div className="text-[11px] text-muted">
                Alert me when my secret reaches milestone upvotes (10, 50, 100)
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.upvotes}
              onChange={() => handleToggleNotif('upvotes')}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-canvas cursor-pointer transition">
            <div>
              <div className="text-xs font-semibold text-main">
                Anonymous Comment Replies
              </div>
              <div className="text-[11px] text-muted">
                Alert me when a student replies to my confessions or comments
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.comments}
              onChange={() => handleToggleNotif('comments')}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-canvas cursor-pointer transition">
            <div>
              <div className="text-xs font-semibold text-main">
                Campus Poll Launches
              </div>
              <div className="text-[11px] text-muted">
                Notify when high-interest voting starts in your academic department
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.polls}
              onChange={() => handleToggleNotif('polls')}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div className="bg-card border border-danger/20 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="font-bold text-xs uppercase tracking-wider">
            Session Controls
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResetSession}
            className="flex-1 py-2.5 px-4 rounded-xl border border-border text-main hover:bg-surface text-xs font-semibold transition cursor-pointer"
          >
            Clear In-Memory State
          </button>

          <button
            onClick={logout}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface hover:bg-[#F9E5EB] text-danger text-xs font-semibold transition cursor-pointer border border-danger/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}

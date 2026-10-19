import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../data/mockData.js';
import {
  Shield,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Bell,
  Edit2,
  Save,
} from '../components/common/icons.jsx';

export default function ProfilePage() {
  const { user, updateProfile, myPosts } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [pseudonymInput, setPseudonymInput] = useState(user.pseudonym);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [collegeInput, setCollegeInput] = useState(user.college);

  const activeAvatarObj =
    AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      pseudonym: pseudonymInput.trim() || user.pseudonym,
      avatar: selectedAvatar,
      college: collegeInput.trim() || user.college,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card Header */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-2xs relative overflow-hidden">
        <div className="h-24 -mx-6 -mt-6 bg-gradient-to-r from-[#211116] via-[#501E30] to-[#B83259]" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
          <div className="flex items-end gap-3.5">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-card shadow-lg ${activeAvatarObj.color} bg-card shrink-0`}
            >
              {activeAvatarObj.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-main">{user.pseudonym}</h2>
                <span className="p-1 rounded-full bg-surface text-deep" title="Verified Campus Student">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                <span className="flex items-center gap-1 text-deep font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {user.college}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) {
                setPseudonymInput(user.pseudonym);
                setSelectedAvatar(user.avatar);
                setCollegeInput(user.college);
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface/80 text-deep text-xs font-semibold transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Alias'}</span>
          </button>
        </div>

        {/* Editing Drawer */}
        {isEditing && (
          <form
            onSubmit={handleSave}
            className="mt-4 p-4 rounded-2xl bg-canvas border border-border space-y-4 animate-in fade-in"
          >
            <h3 className="font-bold text-xs text-deep uppercase tracking-wider">
              Customize Your Disguise
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-main mb-1">
                  Anonymous Pseudonym
                </label>
                <input
                  type="text"
                  value={pseudonymInput}
                  onChange={(e) => setPseudonymInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-main mb-1">
                  College / Institute
                </label>
                <input
                  type="text"
                  value={collegeInput}
                  onChange={(e) => setCollegeInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-main mb-2">
                Persona Avatar
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      selectedAvatar === avatar.id
                        ? 'border-primary bg-card ring-1 ring-primary shadow-xs'
                        : 'border-border bg-card/60 hover:bg-card'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border ${avatar.color}`}
                    >
                      {avatar.name.substring(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[10px] truncate max-w-full font-medium text-main">
                      {avatar.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-muted hover:text-main cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
          <div className="p-3 rounded-2xl bg-canvas border border-border text-center">
            <span className="block text-xl font-black text-deep">
              {myPosts.length}
            </span>
            <span className="text-[11px] font-medium text-muted">Secrets Shared</span>
          </div>
          <div className="p-3 rounded-2xl bg-canvas border border-border text-center">
            <span className="block text-xl font-black text-deep">
              {user.stats.commentsCount}
            </span>
            <span className="text-[11px] font-medium text-muted">Comments</span>
          </div>
          <div className="p-3 rounded-2xl bg-canvas border border-border text-center">
            <span className="block text-xl font-black text-deep">
              {user.stats.upvotesReceived}
            </span>
            <span className="text-[11px] font-medium text-muted">Upvotes Earned</span>
          </div>
          <div className="p-3 rounded-2xl bg-canvas border border-border text-center">
            <span className="block text-xl font-black text-deep">
              {user.stats.savedPostsCount}
            </span>
            <span className="text-[11px] font-medium text-muted">Bookmarks</span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-deep">
            Campus Recognition & Badges
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {user.badges.map((badge, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-deep text-xs font-semibold shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* In-App Notifications Drawer */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-deep">
              Recent Campus Alerts & Mentions
            </h3>
          </div>
          <span className="text-[11px] text-primary font-semibold cursor-pointer hover:underline">
            Mark all read
          </span>
        </div>

        <div className="space-y-2">
          {user.notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-3 transition ${
                notif.unread
                  ? 'bg-surface/50 border-primary/30 font-medium text-main'
                  : 'bg-canvas border-border text-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                {notif.unread && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
                <span>{notif.text}</span>
              </div>
              <span className="text-[11px] text-muted shrink-0">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

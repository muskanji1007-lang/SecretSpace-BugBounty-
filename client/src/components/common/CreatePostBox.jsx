import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORIES, AVATAR_OPTIONS } from '../../data/mockData.js';
import { Send, MapPin, Shield, Check } from './icons.jsx';

const MAX_CHARS = 400;

export default function CreatePostBox({ onPostCreated }) {
  const { addPost, user } = useApp();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('confessions');
  const [collegeTag, setCollegeTag] = useState('Campus Central');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || 'ghost');
  const [customTag, setCustomTag] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);

  const charCount = content.length;
  const charsRemaining = MAX_CHARS - charCount;
  const isValid = charCount >= 5 && charCount <= MAX_CHARS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const tags = customTag.trim()
      ? customTag.split(' ').map((t) => (t.startsWith('#') ? t : `#${t}`))
      : [`#${category}`, '#SecretSpace'];

    addPost({
      content: content.trim(),
      category,
      collegeTag,
      tags,
      authorAvatar: selectedAvatar,
    });

    setContent('');
    setCustomTag('');
    setIsExpanded(false);
    if (onPostCreated) onPostCreated();
  };

  const activeAvatarObj =
    AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs mb-6 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPersonaPicker(!showPersonaPicker)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${activeAvatarObj.color} cursor-pointer hover:ring-2 hover:ring-primary/40 transition shrink-0`}
              title="Click to change your anonymous persona"
            >
              {activeAvatarObj.name.substring(0, 2).toUpperCase()}
            </button>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5" title="Anonymous identity protected">
              <Shield className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's happening on campus? Share a secret, confession, or question..."
              rows={isExpanded ? 3 : 2}
              className="w-full text-sm text-main placeholder:text-muted bg-canvas rounded-xl p-3 border border-border focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition"
            />
          </div>
        </div>

        {/* Persona Disguise Picker */}
        {showPersonaPicker && (
          <div className="mt-3 p-3 bg-surface/50 rounded-xl border border-border animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-deep">
                Pick Your Anonymous Disguise:
              </span>
              <span className="text-[11px] text-muted">Disguise changes per post</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(avatar.id);
                    setShowPersonaPicker(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border text-left cursor-pointer transition ${
                    selectedAvatar === avatar.id
                      ? 'border-primary bg-card text-deep ring-1 ring-primary'
                      : 'border-border bg-card/70 hover:bg-card text-main'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${avatar.color}`}
                  >
                    {avatar.name.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="truncate flex-1">{avatar.name}</span>
                  {selectedAvatar === avatar.id && (
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-border space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary capitalize"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                  Campus Spot
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-primary absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={collegeTag}
                    onChange={(e) => setCollegeTag(e.target.value)}
                    placeholder="e.g. Library 3rd Floor"
                    className="w-full text-xs pl-8 pr-2 py-2 rounded-lg border border-border bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                  Tags (Space separated)
                </label>
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="#midterms #gossip"
                  className="w-full text-xs p-2 rounded-lg border border-border bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                charsRemaining < 0
                  ? 'text-danger font-bold'
                  : charsRemaining < 50
                  ? 'text-warning font-semibold'
                  : 'text-muted'
              }`}
            >
              {charCount}/{MAX_CHARS}
            </span>
            {charCount > 0 && charCount < 5 && (
              <span className="text-[11px] text-warning font-medium hidden sm:inline">
                (Min 5 characters)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isExpanded && (
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setShowPersonaPicker(false);
                }}
                className="px-3 py-1.5 text-xs text-muted hover:text-main cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                isValid
                  ? 'bg-primary hover:bg-deep text-white shadow-primary/20'
                  : 'bg-surface text-muted/60 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Secretly</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

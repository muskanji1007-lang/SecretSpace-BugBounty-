import React from 'react';
import { X, Sparkles } from './icons.jsx';
import CreatePostBox from '../common/CreatePostBox.jsx';

export default function CreatePostModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bento-card rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-border/80 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-white hover:bg-surface transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-main text-base">New Anonymous Secret</h3>
            <p className="text-xs text-muted">Share your thoughts without revealing your identity</p>
          </div>
        </div>

        <CreatePostBox onPostCreated={onClose} />
      </div>
    </div>
  );
}

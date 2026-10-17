import React from 'react';
import { Ghost, Sparkles } from './icons.jsx';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'No whispers or secrets found in this corner of campus.',
  actionLabel,
  onAction,
  icon: Icon = Ghost,
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center my-6 shadow-2xs">
      <div className="w-16 h-16 rounded-2xl bg-surface border border-border text-primary flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-main">{title}</h3>
      <p className="text-muted text-sm max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-deep text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

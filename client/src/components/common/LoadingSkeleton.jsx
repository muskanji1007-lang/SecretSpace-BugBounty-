import React from 'react';

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl p-5 shadow-2xs animate-pulse space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-surface rounded w-1/4" />
              <div className="h-3 bg-surface/50 rounded w-1/6" />
            </div>
            <div className="h-6 w-16 bg-surface/50 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-surface/80 rounded w-full" />
            <div className="h-4 bg-surface/60 rounded w-5/6" />
            <div className="h-4 bg-surface/40 rounded w-3/4" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-surface/60 rounded-lg" />
              <div className="h-8 w-16 bg-surface/60 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-surface/60 rounded-lg" />
              <div className="h-8 w-8 bg-surface/60 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

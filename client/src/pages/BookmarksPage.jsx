import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PostCard from '../components/common/PostCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { Bookmark } from '../components/common/icons.jsx';

export default function BookmarksPage() {
  const { bookmarkedPosts } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface text-primary flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="font-bold text-deep text-base">Saved Secrets</h2>
            <p className="text-xs text-muted">
              Only visible to you during this anonymous session
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface text-deep border border-border">
          {bookmarkedPosts.length} saved
        </span>
      </div>

      {bookmarkedPosts.length > 0 ? (
        <div className="space-y-4">
          {bookmarkedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved bookmarks yet"
          description="Whenever you find a helpful study tip, hilarious confession, or interesting poll, tap the bookmark icon to save it here."
          actionLabel="Explore Feed"
          onAction={() => navigate('/')}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import api from '../services/api.js';
import PostCard from '../components/common/PostCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import {
  Activity,
  Flame,
  ThumbsUp,
} from '../components/common/icons.jsx';

export default function MyActivityPage() {
  const { posts, myPosts, user, backendStatus, isLoggedIn } = useApp();
  const [activeTab, setActiveTab] = useState('posts');
  const [remoteActivity, setRemoteActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (backendStatus.online && backendStatus.database === 'connected' && isLoggedIn) {
      setIsLoading(true);
      api.users
        .getActivity()
        .then((res) => {
          if (isMounted && res?.data) {
            setRemoteActivity(res.data);
          }
        })
        .catch((err) => {
          console.warn('[MyActivity] Could not fetch remote activity:', err.message);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [backendStatus.online, backendStatus.database, isLoggedIn]);

  const displayedPosts = React.useMemo(() => {
    if (remoteActivity?.posts && remoteActivity.posts.length > 0) {
      const remoteIds = new Set(remoteActivity.posts.map((p) => p.id));
      const localOnly = myPosts.filter((p) => !remoteIds.has(p.id));
      return [...localOnly, ...remoteActivity.posts];
    }
    return myPosts;
  }, [remoteActivity, myPosts]);

  const displayedUpvoted = React.useMemo(() => {
    if (remoteActivity?.upvotedPosts && remoteActivity.upvotedPosts.length > 0) {
      return remoteActivity.upvotedPosts;
    }
    return posts.filter((p) => p.userVote === 'up');
  }, [remoteActivity, posts]);

  const stats = remoteActivity?.stats || user?.stats || {
    confessionsCount: displayedPosts.length,
    commentsCount: 0,
    upvotesReceived: 0,
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-surface text-deep flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-deep text-base">My Campus Activity</h2>
            <p className="text-xs text-muted">
              Your anonymous footprint & contributions this semester
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border">
          <div className="p-3 rounded-xl bg-surface/40 border border-border text-center">
            <div className="text-lg font-black text-deep">
              {displayedPosts.length}
            </div>
            <div className="text-[11px] font-medium text-muted">Secrets Shared</div>
          </div>

          <div className="p-3 rounded-xl bg-surface/40 border border-border text-center">
            <div className="text-lg font-black text-deep">
              {stats.commentsCount || 0}
            </div>
            <div className="text-[11px] font-medium text-muted">Comments</div>
          </div>

          <div className="p-3 rounded-xl bg-surface/40 border border-border text-center">
            <div className="text-lg font-black text-deep">
              {displayedUpvoted.length}
            </div>
            <div className="text-[11px] font-medium text-muted">Upvoted</div>
          </div>

          <div className="p-3 rounded-xl bg-surface/40 border border-border text-center">
            <div className="text-lg font-black text-deep">
              {stats.upvotesReceived || 0}
            </div>
            <div className="text-[11px] font-medium text-muted">Karma Earned</div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'border-primary text-deep'
              : 'border-transparent text-muted hover:text-deep'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>My Dropped Secrets ({displayedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upvoted')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'upvoted'
              ? 'border-primary text-deep'
              : 'border-transparent text-muted hover:text-deep'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Upvoted by Me ({displayedUpvoted.length})</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={2} />
      ) : activeTab === 'posts' ? (
        <div className="space-y-4">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={Flame}
              title="You haven't posted any secrets yet"
              description="Drop your first anonymous confession, campus hack, or exam question using the input at the top of the feed."
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedUpvoted.length > 0 ? (
            displayedUpvoted.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={ThumbsUp}
              title="No upvoted posts yet"
              description="Upvote posts in the feed that you find funny, relatable, or helpful."
            />
          )}
        </div>
      )}
    </div>
  );
}

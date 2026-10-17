import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import PostCard from '../components/common/PostCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import {
  Activity,
  Flame,
  ThumbsUp,
} from '../components/common/icons.jsx';

export default function MyActivityPage() {
  const { posts, myPosts, user } = useApp();
  const [activeTab, setActiveTab] = useState('posts');

  const upvotedPosts = posts.filter((p) => p.userVote === 'up');

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
              {myPosts.length}
            </div>
            <div className="text-[11px] font-medium text-muted">Secrets Shared</div>
          </div>

          <div className="p-3 rounded-xl bg-surface/40 border border-border text-center">
            <div className="text-lg font-black text-deep">
              {user.stats.commentsCount}
            </div>
            <div className="text-[11px] font-medium text-muted">Comments</div>
          </div>

          <div className="p-3 rounded-xl bg-surface/40 border border-border text-center">
            <div className="text-lg font-black text-deep">
              {upvotedPosts.length}
            </div>
            <div className="text-[11px] font-medium text-muted">Upvoted</div>
          </div>

          <div className="p-3 rounded-xl bg-surface/40 border border-border text-center">
            <div className="text-lg font-black text-deep">
              {user.stats.upvotesReceived}
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
          <span>My Dropped Secrets ({myPosts.length})</span>
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
          <span>Upvoted by Me ({upvotedPosts.length})</span>
        </button>
      </div>

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {myPosts.length > 0 ? (
            myPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={Flame}
              title="You haven't posted any secrets yet"
              description="Drop your first anonymous confession, campus hack, or exam question using the input at the top of the feed."
            />
          )}
        </div>
      )}

      {activeTab === 'upvoted' && (
        <div className="space-y-4">
          {upvotedPosts.length > 0 ? (
            upvotedPosts.map((post) => <PostCard key={post.id} post={post} />)
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

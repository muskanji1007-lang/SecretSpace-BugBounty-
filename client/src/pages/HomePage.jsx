import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES } from '../data/mockData.js';
import PostCard from '../components/common/PostCard.jsx';
import CreatePostBox from '../components/common/CreatePostBox.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import HeroBanner from '../components/common/HeroBanner.jsx';
import CreatePostModal from '../components/common/CreatePostModal.jsx';
import { Flame, Clock, Trophy, MessageSquareDashed } from '../components/common/icons.jsx';

export default function HomePage() {
  const {
    filteredPosts,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryChange = (catId) => {
    setIsLoading(true);
    setActiveCategory(catId);
    setTimeout(() => setIsLoading(false), 200);
  };

  return (
    <div className="space-y-4">
      <HeroBanner onOpenCreateModal={() => setIsModalOpen(true)} />

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              activeCategory === cat.id
                ? 'bg-primary text-white shadow-md shadow-primary/25 border-primary scale-[1.02]'
                : 'bg-surface/70 hover:bg-surface text-muted hover:text-main border-border/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <CreatePostBox />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted font-medium">Sort by:</span>
          <button
            onClick={() => setSortBy('hot')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition cursor-pointer border ${
              sortBy === 'hot'
                ? 'bg-primary/15 text-primary border-primary/30 shadow-xs'
                : 'border-transparent text-muted hover:text-main hover:bg-surface/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hot</span>
          </button>
          <button
            onClick={() => setSortBy('new')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition cursor-pointer border ${
              sortBy === 'new'
                ? 'bg-primary/15 text-primary border-primary/30 shadow-xs'
                : 'border-transparent text-muted hover:text-main hover:bg-surface/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition cursor-pointer border ${
              sortBy === 'top'
                ? 'bg-primary/15 text-primary border-primary/30 shadow-xs'
                : 'border-transparent text-muted hover:text-main hover:bg-surface/50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>

        <span className="text-[11px] font-medium text-muted">
          {filteredPosts.length} secret{filteredPosts.length === 1 ? '' : 's'}
        </span>
      </div>
      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquareDashed}
          title="No secrets in this category"
          description="Be the first one on campus to share something in this channel!"
          actionLabel="Share a Secret"
          onAction={() => setActiveCategory('all')}
        />
      )}

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

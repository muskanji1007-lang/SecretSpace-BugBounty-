import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES } from '../data/mockData.js';
import PostCard from '../components/common/PostCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import {
  Search,
  X,
  Compass,
  TrendingUp,
  Sparkles,
  Flame,
  GraduationCap,
  Home,
  Coffee,
  Heart,
} from '../components/common/icons.jsx';

const ICON_MAP = {
  Sparkles,
  Flame,
  GraduationCap,
  Home,
  Coffee,
  Heart,
  Search,
};

const POPULAR_TAGS = [
  '#Midterms',
  '#PlacementSeason',
  '#HostelNight',
  '#CampusCrush',
  '#LibraryQuietHours',
  '#MessFood',
  '#Internships2026',
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filteredPosts,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
  } = useApp();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setSearchParams({ q: tag });
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <div className="bento-card rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-main text-base">Explore Campus</h2>
            <p className="text-xs text-muted">Discover secrets, trends, and specific topics</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="Search keywords, confessions, or specific tags..."
            className="w-full text-sm pl-10 pr-10 py-2.5 rounded-xl bg-surface/60 border border-border text-main placeholder:text-muted focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-3 text-muted hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-semibold text-muted shrink-0 mr-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-primary" />
            Popular:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-surface/60 hover:bg-surface text-main border border-border hover:border-primary/40 whitespace-nowrap transition cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 px-1">
          Browse by Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-3 sm:p-4 rounded-2xl border text-left flex items-start gap-2.5 sm:gap-3 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                    : 'border-border/80 bg-card hover:border-primary/40 hover:bg-surface/70 text-main'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-surface text-primary border border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs truncate">{cat.label}</div>
                  <div
                    className={`text-[11px] mt-0.5 truncate ${
                      isSelected ? 'text-white/80' : 'text-muted'
                    }`}
                  >
                    Channel
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-1 pt-2">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
          {searchQuery ? `Results for "${searchQuery}"` : 'Recent Channel Posts'}
        </h3>
        <span className="text-xs text-muted">
          {filteredPosts.length} post{filteredPosts.length === 1 ? '' : 's'}
        </span>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No secrets match your search"
          description={`We couldn't find any confessions or posts matching "${searchQuery}". Try different keywords or browse all categories.`}
          actionLabel="Clear Search"
          onAction={handleClear}
        />
      )}
    </div>
  );
}

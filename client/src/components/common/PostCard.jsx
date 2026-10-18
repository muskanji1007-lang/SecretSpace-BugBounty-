import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../../data/mockData.js';
import ReportModal from './ReportModal.jsx';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  MapPin,
  Clock,
} from './icons.jsx';

export default function PostCard({ post, isDetailView = false }) {
  const { votePost, toggleBookmark, addToast } = useApp();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const avatarInfo = AVATAR_OPTIONS.find((a) => a.id === post.authorAvatar) || AVATAR_OPTIONS[0];

  const handleShare = () => {
    const shareUrl = window.location.origin + `/post/${post.id}`;
    // BUG-11: Premature "Copied" toast fires synchronously before clipboard promise resolves
    navigator.clipboard?.writeText(shareUrl);
    addToast('Post link copied to clipboard!', 'info');
  };

  const netScore = post.upvotes - post.downvotes;

  return (
    <>
      <article className="bg-card border border-border rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-primary/40 transition duration-200">
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${avatarInfo.color} shrink-0`}
            >
              {avatarInfo.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-main text-sm">
                  {post.authorPseudonym}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-deep bg-surface px-2 py-0.5 rounded-full border border-border">
                  <MapPin className="w-3 h-3 text-primary" />
                  {post.collegeTag}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted text-xs mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface text-deep capitalize border border-border shrink-0">
            {post.category}
          </span>
        </div>

        <div className="mb-4">
          {isDetailView ? (
            <p className="text-main text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          ) : (
            <Link to={`/post/${post.id}`} className="group block">
              <p className="text-main text-[15px] leading-relaxed group-hover:text-deep transition">
                {post.content}
              </p>
            </Link>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag, idx) => (
                // BUG-02: Hashtag renders as plain static span without navigation or click handler
                <span
                  key={idx}
                  className="text-xs font-medium text-primary cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border text-muted text-xs">
          <div className="flex items-center bg-canvas border border-border rounded-xl p-0.5">
            <button
              onClick={() => votePost(post.id, 'up')}
              className={`p-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                post.userVote === 'up'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted hover:bg-surface hover:text-deep'
              }`}
              title="Upvote"
              aria-label="Upvote"
            >
              <ArrowBigUp className="w-4 h-4 fill-current" />
              <span className="font-semibold px-0.5">{netScore}</span>
            </button>

            <button
              onClick={() => votePost(post.id, 'down')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                post.userVote === 'down'
                  ? 'bg-danger text-white shadow-xs'
                  : 'text-muted hover:bg-surface hover:text-danger'
              }`}
              title="Downvote"
              aria-label="Downvote"
            >
              <ArrowBigDown className="w-4 h-4 fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to={`/post/${post.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface text-muted hover:text-deep transition"
              title="Comments"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{post.commentCount || 0}</span>
            </Link>

            <button
              onClick={() => toggleBookmark(post.id)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                post.isBookmarked
                  ? 'bg-surface text-primary'
                  : 'hover:bg-surface text-muted hover:text-deep'
              }`}
              title={post.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              aria-label="Bookmark"
            >
              <Bookmark
                className={`w-4 h-4 ${post.isBookmarked ? 'fill-current text-primary' : ''}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl hover:bg-surface text-muted hover:text-deep transition cursor-pointer"
              title="Share"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsReportOpen(true)}
              className="p-2 rounded-xl hover:bg-rose-50 text-muted hover:text-danger transition cursor-pointer"
              title="Report Post"
              aria-label="Report"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        post={post}
      />
    </>
  );
}

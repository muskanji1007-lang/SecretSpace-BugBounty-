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
  Trash2,
} from './icons.jsx';

export default function PostCard({ post, isDetailView = false, onDelete }) {
  const { votePost, toggleBookmark, deletePost, user, addToast } = useApp();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor =
    post.isMyPost ||
    (post.authorPseudonym || '').includes('(You)') ||
    (user?.pseudonym && post.authorPseudonym === user.pseudonym) ||
    (user?._id && post.author === user._id) ||
    (user?.id && post.author === user.id);
  const isAuthorOrAdmin = isAuthor || user?.role === 'admin';

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      const success = await deletePost(post.id || post._id);
      if (success && onDelete) {
        onDelete();
      }
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const avatarInfo = AVATAR_OPTIONS.find((a) => a.id === post.authorAvatar) || AVATAR_OPTIONS[0];

  const handleShare = () => {
    const shareUrl = window.location.origin + `/post/${post.id}`;
    navigator.clipboard?.writeText(shareUrl);
    addToast('Post link copied to clipboard!', 'info');
  };

  const netScore = post.upvotes - post.downvotes;

  return (
    <>
      <article className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs hover:border-primary/40 transition duration-200">
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

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border text-muted text-xs">
          <div className="flex items-center bg-canvas border border-border rounded-xl p-0.5 shrink-0">
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

          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
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
              className="p-2 rounded-xl hover:bg-surface text-muted hover:text-danger transition cursor-pointer"
              title="Report Post"
              aria-label="Report"
            >
              <Flag className="w-4 h-4" />
            </button>

            {isAuthorOrAdmin && (
              showConfirmDelete ? (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="flex items-center gap-1.5 bg-danger/10 border border-danger/20 px-2 py-1 rounded-xl text-xs animate-in fade-in"
                >
                  <span className="text-danger font-semibold text-[11px]">Delete?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-2 py-0.5 bg-danger text-white rounded-lg font-semibold hover:bg-danger-hover cursor-pointer text-xs transition"
                  >
                    {isDeleting ? '...' : 'Yes'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowConfirmDelete(false);
                    }}
                    className="px-1.5 py-0.5 text-muted hover:text-main cursor-pointer text-xs transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirmDelete(true);
                  }}
                  className="p-2 rounded-xl hover:bg-danger/10 text-muted hover:text-danger transition cursor-pointer"
                  title={user?.role === 'admin' && !isAuthor ? 'Delete Post (Admin Moderation)' : 'Delete Post'}
                  aria-label="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )
            )}
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

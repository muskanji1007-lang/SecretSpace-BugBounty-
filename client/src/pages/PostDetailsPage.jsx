import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { AVATAR_OPTIONS } from '../data/mockData.js';
import PostCard from '../components/common/PostCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import {
  ArrowLeft,
  Send,
  CornerDownRight,
  ThumbsUp,
  MessageSquare,
  Shield,
  Clock,
} from '../components/common/icons.jsx';

const MAX_COMMENT_LENGTH = 300;

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, addComment, addReply, user, addToast } = useApp();

  const [commentText, setCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [upvotedComments, setUpvotedComments] = useState(new Set());
  const [commentCountDelta, setCommentCountDelta] = useState(0);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-deep transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
        <EmptyState
          title="Secret not found"
          description="This post may have been removed or the link is incorrect."
          actionLabel="Return to Feed"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentCountDelta(0);
    setCommentText('');
  };

  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) return;
    addReply(post.id, commentId, replyText.trim());
    setReplyText('');
    setActiveReplyId(null);
  };

  const handleCommentUpvote = (commentId) => {
    if (upvotedComments.has(commentId)) {
      addToast('You already upvoted this comment', 'info');
      return;
    }
    setUpvotedComments((prev) => new Set([...prev, commentId]));
    const targetComment = (post.comments || []).find((c) => c.id === commentId);
    if (targetComment) {
      targetComment.upvotes = (targetComment.upvotes || 0) + 1;
    }
    addToast('Comment upvoted anonymously!', 'success');
  };

  const currentUserAvatar =
    AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="tactile-btn inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-deep transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs text-muted">Post #{post.id.replace('post-', '')}</span>
      </div>

      <PostCard post={post} isDetailView={true} onDelete={() => navigate('/')} />

      <div className="bento-card bento-lift rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${currentUserAvatar.color}`}
            >
              {currentUserAvatar.name.substring(0, 2).toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-main">
              Commenting anonymously as {user.pseudonym}
            </span>
          </div>
          <span className="text-[11px] text-muted">
            {commentText.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>

        <form onSubmit={handleCommentSubmit} className="space-y-2.5">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder="Write an anonymous reply..."
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-border bg-surface/50 focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary text-main placeholder:text-muted resize-none transition"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-muted">
              <Shield className="w-3 h-3 text-primary" />
              <span>Identity stays confidential</span>
            </div>

            <div className="flex items-center gap-2">
              {commentText && (
                <button
                  type="button"
                  onClick={() => {
                    setCommentText('');
                    setCommentCountDelta((prev) => prev - 1);
                    if (post.comments) {
                      post.commentCount = Math.max(0, (post.commentCount || post.comments.length) - 1);
                    }
                  }}
                  className="tactile-btn px-2.5 py-1 text-xs text-muted hover:text-danger cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`tactile-btn shimmer-sheen inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                  commentText.trim()
                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-surface text-muted/60 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-main">
            Discussion ({Math.max(0, (post.commentCount || (post.comments ? post.comments.length : 0)) + commentCountDelta)})
          </h3>
        </div>

        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-2.5">
            {post.comments.map((comment) => {
              const commentAvatar =
                AVATAR_OPTIONS.find((a) => a.id === comment.avatar) || AVATAR_OPTIONS[0];

              return (
                <div
                  key={comment.id}
                  className="bento-card bento-lift rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border ${commentAvatar.color}`}
                      >
                        {commentAvatar.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-xs text-main">
                        {comment.author}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {comment.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-main leading-relaxed pl-3 sm:pl-9">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4 pl-3 sm:pl-9 text-[11px] text-muted pt-1">
                    <button
                      className="tactile-btn flex items-center gap-1 transition text-muted hover:text-deep cursor-pointer"
                      title="Upvote comment"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.upvotes || 0}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveReplyId(
                          activeReplyId === comment.id ? null : comment.id
                        )
                      }
                      className="tactile-btn text-primary font-semibold hover:text-deep hover:underline cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>

                  {activeReplyId === comment.id && (
                    <div className="ml-3 sm:ml-9 p-3 bg-surface/50 rounded-xl border border-border space-y-2 animate-in fade-in">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        maxLength={MAX_COMMENT_LENGTH}
                        placeholder={`Reply to ${comment.author}...`}
                        className="w-full text-xs p-2 rounded-lg bg-card border border-border text-main placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="tactile-btn px-2.5 py-1 text-xs text-muted hover:text-main cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReplySubmit(comment.id)}
                          className="tactile-btn shimmer-sheen px-3 py-1 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-3 sm:ml-9 pl-3 border-l-2 border-border space-y-2.5 pt-1">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-muted">
                            <CornerDownRight className="w-3 h-3 text-primary shrink-0" />
                            <span className="font-semibold text-[11px] text-main">
                              {reply.author}
                            </span>
                            <span className="text-[10px] text-muted">• {reply.timestamp}</span>
                          </div>
                          <p className="text-main pl-4">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No comments yet"
            description="Start the anonymous conversation! What do you think about this secret?"
          />
        )}
      </div>
    </div>
  );
}

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must be attached to a post'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      trim: true,
      maxlength: [300, 'Comment cannot exceed 300 characters'],
    },
    // Internal user reference for ownership. NEVER exposed in public API output.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    // Public anonymous display identity
    authorPseudonym: {
      type: String,
      required: true,
      trim: true,
    },
    authorAvatar: {
      id: { type: String, default: 'ghost' },
      name: { type: String, default: 'Stealth Phantom' },
      emoji: { type: String, default: '👻' },
      bg: { type: String, default: 'bg-surface text-deep border-border' },
    },
    upvotes: {
      type: Number,
      default: 1,
      min: 0,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ post: 1, createdAt: 1 });

export const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

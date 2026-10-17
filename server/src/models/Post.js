import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      trim: true,
      maxlength: [500, 'Post cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['confessions', 'academics', 'hostel', 'events', 'crushes', 'lostfound', 'career'],
        message: '{VALUE} is not a valid category',
      },
      default: 'confessions',
    },
    collegeTag: {
      type: String,
      default: 'Campus North',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Internal user reference for ownership/moderation. NEVER exposed in public API output.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false, // Hidden by default from queries
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
    downvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    flagCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for feed sorting, category filtering, and keyword search
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ upvotes: -1 });
postSchema.index({ content: 'text', tags: 'text' });

export const Post = mongoose.model('Post', postSchema);
export default Post;

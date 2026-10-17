import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bookmarks by the same user on the same post
bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;

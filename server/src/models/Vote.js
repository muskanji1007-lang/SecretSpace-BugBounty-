import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ['post', 'comment', 'poll'],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // Used for post/comment votes ('up' or 'down')
    direction: {
      type: String,
      enum: ['up', 'down', null],
      default: null,
    },
    // Used for poll votes (referencing the chosen option subdocument ID)
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce one vote per user per target item at database level
voteSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Vote = mongoose.model('Vote', voteSchema);
export default Vote;

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    reportedItemType: {
      type: String,
      enum: ['post', 'comment'],
      default: 'post',
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    // Internal user reference for anti-spam. NEVER shown to regular users or public.
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    reason: {
      type: String,
      required: [true, 'Report reason is required'],
      enum: [
        'Harassment or Bullying',
        'Hate Speech',
        'Spam or Promotional',
        'Doxxing or Personal Info',
        'Other Violation',
      ],
    },
    details: {
      type: String,
      maxlength: [300, 'Details cannot exceed 300 characters'],
      trim: true,
    },
    snippet: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'dismissed', 'content_removed'],
      default: 'pending',
    },
    actionTakenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actionTakenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);
export default Report;

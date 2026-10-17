import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required'],
    trim: true,
    maxlength: [100, 'Option cannot exceed 100 characters'],
  },
  votes: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Poll question is required'],
      trim: true,
      maxlength: [200, 'Question cannot exceed 200 characters'],
    },
    options: {
      type: [optionSchema],
      validate: [
        (val) => val.length >= 2 && val.length <= 6,
        'Poll must have between 2 and 6 options',
      ],
    },
    collegeTag: {
      type: String,
      default: 'Campus Pulse',
      trim: true,
    },
    // Internal user reference. Never exposed in public output.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    authorPseudonym: {
      type: String,
      required: true,
      trim: true,
    },
    totalVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
    },
  },
  {
    timestamps: true,
  }
);

pollSchema.index({ createdAt: -1 });

export const Poll = mongoose.model('Poll', pollSchema);
export default Poll;

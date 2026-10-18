import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'College email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    pseudonym: {
      type: String,
      required: [true, 'Anonymous alias is required'],
      trim: true,
      maxlength: [40, 'Alias cannot exceed 40 characters'],
      default: 'Anonymous Student',
    },
    avatar: {
      id: { type: String, default: 'ghost' },
      name: { type: String, default: 'Stealth Phantom' },
      emoji: { type: String, default: '👻' },
      bg: { type: String, default: 'bg-surface text-deep border-border' },
    },
    collegeTag: {
      type: String,
      default: 'Campus North',
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    karma: {
      type: Number,
      default: 10,
    },
    stats: {
      confessionsCount: { type: Number, default: 0 },
      commentsCount: { type: Number, default: 0 },
      upvotesReceived: { type: Number, default: 0 },
    },
    settings: {
      notifications: {
        upvotes: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        polls: { type: Boolean, default: true },
        trendingAlerts: { type: Boolean, default: false },
      },
      privacy: {
        scrambleWeekly: { type: Boolean, default: true },
        hideHostelWing: { type: Boolean, default: false },
        blurSensitive: { type: Boolean, default: true },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password with bcryptjs
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip password from JSON serialization
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = mongoose.model('User', userSchema);
export default User;

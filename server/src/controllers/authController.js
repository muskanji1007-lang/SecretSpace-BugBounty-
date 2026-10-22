import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const formatAvatar = (inputAvatar) => {
  if (typeof inputAvatar === 'string') {
    return {
      id: inputAvatar,
      name: inputAvatar,
      emoji: '🎭',
      bg: 'bg-surface text-deep border-border',
    };
  }
  if (inputAvatar && typeof inputAvatar === 'object') {
    return {
      id: inputAvatar.id || 'ghost',
      name: inputAvatar.name || 'Stealth Phantom',
      emoji: inputAvatar.emoji || '👻',
      bg: inputAvatar.bg || 'bg-surface text-deep border-border',
    };
  }
  return {
    id: 'ghost',
    name: 'Stealth Phantom',
    emoji: '👻',
    bg: 'bg-surface text-deep border-border',
  };
};

// Register new user
export const register = async (req, res, next) => {
  try {
    const { email, password, pseudonym, avatar, collegeTag } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
        code: 'MISSING_FIELDS',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        code: 'PASSWORD_TOO_SHORT',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this campus email already exists',
        code: 'USER_EXISTS',
      });
    }

    // First user can be made admin if none exists, or regular user
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await User.create({
      email,
      password,
      pseudonym: pseudonym || 'Anonymous Student',
      avatar: formatAvatar(avatar),
      collegeTag: collegeTag || 'Campus North',
      role,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user,
      message: 'Account created successfully with full anonymity preserved.',
    });
  } catch (error) {
    next(error);
  }
};

// Login existing user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
        code: 'MISSING_FIELDS',
      });
    }

    // Include password field explicitly since it's not selected by default or for checking
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user,
      message: 'Logged in successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile (pseudonym, avatar, collegeTag, settings)
export const updateProfile = async (req, res, next) => {
  try {
    const { pseudonym, avatar, collegeTag, settings } = req.body;

    const updates = {};
    if (pseudonym) updates.pseudonym = pseudonym.trim();
    if (avatar) updates.avatar = formatAvatar(avatar);
    if (collegeTag) updates.collegeTag = collegeTag.trim();
    if (settings) updates.settings = settings;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      user: updatedUser,
      message: 'Disguise and preferences updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

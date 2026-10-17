import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Vote } from '../models/Vote.js';
import { User } from '../models/User.js';

// Get current user's anonymous activity (posts created, comments made, upvoted items)
export const getUserActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [userPosts, userComments, upvotes] = await Promise.all([
      // Posts authored by this user
      Post.find({ author: userId, isRemoved: { $ne: true } })
        .select('-author')
        .sort({ createdAt: -1 })
        .lean(),

      // Comments authored by this user
      Comment.find({ author: userId, isRemoved: { $ne: true } })
        .select('-author')
        .populate('post', 'content category')
        .sort({ createdAt: -1 })
        .lean(),

      // Upvoted posts
      Vote.find({ user: userId, targetType: 'post', direction: 'up' })
        .populate({
          path: 'targetId',
          model: 'Post',
          match: { isRemoved: { $ne: true } },
          select: '-author',
        })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const upvotedPosts = upvotes
      .filter((v) => v.targetId != null)
      .map((v) => ({
        ...v.targetId,
        id: v.targetId._id.toString(),
        userVote: 'up',
      }));

    res.json({
      success: true,
      data: {
        posts: userPosts.map((p) => ({ ...p, id: p._id.toString(), userVote: 'up' })),
        comments: userComments.map((c) => ({ ...c, id: c._id.toString() })),
        upvotedPosts,
        stats: req.user.stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

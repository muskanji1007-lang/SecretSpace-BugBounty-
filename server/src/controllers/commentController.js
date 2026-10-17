import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

// Get comments for a specific post
export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId, isRemoved: { $ne: true } })
      .select('-author')
      .sort({ createdAt: 1 })
      .lean();

    // Organize into top-level comments and nested replies
    const topLevel = [];
    const replyMap = {};

    comments.forEach((c) => {
      const item = { ...c, id: c._id.toString() };
      if (c.parentId) {
        const parentKey = c.parentId.toString();
        if (!replyMap[parentKey]) replyMap[parentKey] = [];
        replyMap[parentKey].push(item);
      } else {
        topLevel.push(item);
      }
    });

    const structured = topLevel.map((comment) => ({
      ...comment,
      replies: replyMap[comment.id] || [],
    }));

    res.json({
      success: true,
      data: structured,
    });
  } catch (error) {
    next(error);
  }
};

// Add a new comment or reply
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty',
        code: 'EMPTY_COMMENT',
      });
    }

    if (content.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 300 characters',
        code: 'COMMENT_TOO_LONG',
      });
    }

    const post = await Post.findById(postId);
    if (!post || post.isRemoved) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or has been removed',
        code: 'POST_NOT_FOUND',
      });
    }

    const comment = await Comment.create({
      post: postId,
      content: content.trim(),
      parentId: parentId || null,
      author: req.user._id,
      authorPseudonym: `${req.user.pseudonym} (You)`,
      authorAvatar: req.user.avatar,
      upvotes: 1,
    });

    // Increment post comment counter
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    // Increment user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.commentsCount': 1, karma: 2 },
    });

    const responseComment = comment.toObject();
    delete responseComment.author;

    res.status(201).json({
      success: true,
      data: {
        ...responseComment,
        id: responseComment._id.toString(),
        replies: [],
      },
      message: 'Anonymous comment posted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

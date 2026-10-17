import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Vote } from '../models/Vote.js';
import { Bookmark } from '../models/Bookmark.js';
import { User } from '../models/User.js';

// Get list of posts with filtering, sorting, and user-state enrichment
export const getPosts = async (req, res, next) => {
  try {
    const { category, sort = 'hot', search, page = 1, limit = 25 } = req.query;

    const query = { isRemoved: { $ne: true } };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { content: searchRegex },
        { tags: searchRegex },
        { authorPseudonym: searchRegex },
      ];
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'top') {
      sortOptions = { upvotes: -1, createdAt: -1 };
    } else if (sort === 'hot') {
      // Sort by upvotes and commentCount combined
      sortOptions = { upvotes: -1, commentCount: -1, createdAt: -1 };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [posts, totalPosts] = await Promise.all([
      Post.find(query)
        .select('-author') // Strictly exclude author user ID for anonymity
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Post.countDocuments(query),
    ]);

    // If authenticated, enrich with current user's votes and bookmarks
    let userVotesMap = {};
    let userBookmarksSet = new Set();

    if (req.user) {
      const postIds = posts.map((p) => p._id);
      const [votes, bookmarks] = await Promise.all([
        Vote.find({
          user: req.user._id,
          targetType: 'post',
          targetId: { $in: postIds },
        }).lean(),
        Bookmark.find({
          user: req.user._id,
          post: { $in: postIds },
        }).lean(),
      ]);

      votes.forEach((v) => {
        userVotesMap[v.targetId.toString()] = v.direction;
      });

      bookmarks.forEach((b) => {
        userBookmarksSet.add(b.post.toString());
      });
    }

    const enrichedPosts = posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      userVote: userVotesMap[post._id.toString()] || null,
      isBookmarked: userBookmarksSet.has(post._id.toString()),
    }));

    res.json({
      success: true,
      data: enrichedPosts,
      pagination: {
        total: totalPosts,
        page: parseInt(page, 10),
        pages: Math.ceil(totalPosts / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new anonymous post
export const createPost = async (req, res, next) => {
  try {
    const { content, category, collegeTag, tags, authorAvatar } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty',
        code: 'EMPTY_CONTENT',
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Post content exceeds the 500-character limit',
        code: 'CONTENT_TOO_LONG',
      });
    }

    const post = await Post.create({
      content: content.trim(),
      category: category || 'confessions',
      collegeTag: collegeTag || req.user.collegeTag || 'Campus North',
      tags: Array.isArray(tags) ? tags : [],
      author: req.user._id,
      authorPseudonym: `${req.user.pseudonym} (You)`,
      authorAvatar: authorAvatar || req.user.avatar,
      upvotes: 1, // Author starts with 1 upvote
      downvotes: 0,
    });

    // Automatically record the author's initial upvote
    await Vote.create({
      user: req.user._id,
      targetType: 'post',
      targetId: post._id,
      direction: 'up',
    });

    // Increment user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.confessionsCount': 1, karma: 5 },
    });

    const responsePost = post.toObject();
    delete responsePost.author;

    res.status(201).json({
      success: true,
      data: {
        ...responsePost,
        id: responsePost._id.toString(),
        userVote: 'up',
        isBookmarked: false,
      },
      message: 'Anonymous post published successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Get single post by ID with comments
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).select('-author').lean();
    if (!post || post.isRemoved) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or has been removed by moderation.',
        code: 'POST_NOT_FOUND',
      });
    }

    // Fetch comments for this post
    const comments = await Comment.find({ post: id, isRemoved: { $ne: true } })
      .select('-author')
      .sort({ createdAt: 1 })
      .lean();

    let userVote = null;
    let isBookmarked = false;

    if (req.user) {
      const [existingVote, existingBookmark] = await Promise.all([
        Vote.findOne({ user: req.user._id, targetType: 'post', targetId: id }),
        Bookmark.findOne({ user: req.user._id, post: id }),
      ]);
      if (existingVote) userVote = existingVote.direction;
      if (existingBookmark) isBookmarked = true;
    }

    res.json({
      success: true,
      data: {
        ...post,
        id: post._id.toString(),
        userVote,
        isBookmarked,
        comments: comments.map((c) => ({
          ...c,
          id: c._id.toString(),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Vote on a post (up / down / undo)
export const votePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { direction } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({
        success: false,
        message: 'Vote direction must be either "up" or "down"',
        code: 'INVALID_DIRECTION',
      });
    }

    const post = await Post.findById(id);
    if (!post || post.isRemoved) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND',
      });
    }

    const existingVote = await Vote.findOne({
      user: req.user._id,
      targetType: 'post',
      targetId: id,
    });

    let newDirection = direction;
    let upvoteDiff = 0;
    let downvoteDiff = 0;

    if (existingVote) {
      if (existingVote.direction === direction) {
        // Toggle off / undo vote
        await Vote.deleteOne({ _id: existingVote._id });
        newDirection = null;
        if (direction === 'up') upvoteDiff = -1;
        if (direction === 'down') downvoteDiff = -1;
      } else {
        // Switch direction
        existingVote.direction = direction;
        await existingVote.save();
        if (direction === 'up') {
          upvoteDiff = 1;
          downvoteDiff = -1;
        } else {
          upvoteDiff = -1;
          downvoteDiff = 1;
        }
      }
    } else {
      // Cast new vote
      await Vote.create({
        user: req.user._id,
        targetType: 'post',
        targetId: id,
        direction,
      });
      if (direction === 'up') upvoteDiff = 1;
      if (direction === 'down') downvoteDiff = 1;
    }

    post.upvotes = Math.max(0, post.upvotes + upvoteDiff);
    post.downvotes = Math.max(0, post.downvotes + downvoteDiff);
    await post.save();

    res.json({
      success: true,
      data: {
        id: post._id.toString(),
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        userVote: newDirection,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete post (author or admin only)
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).select('+author');
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND',
      });
    }

    const isAuthor = post.author && post.author.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
        code: 'UNAUTHORIZED_DELETE',
      });
    }

    post.isRemoved = true;
    await post.save();

    res.json({
      success: true,
      message: 'Post removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

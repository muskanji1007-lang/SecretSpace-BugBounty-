import { Bookmark } from '../models/Bookmark.js';
import { Post } from '../models/Post.js';
import { Vote } from '../models/Vote.js';

// Get all bookmarked posts for the authenticated user
export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'post',
        match: { isRemoved: { $ne: true } },
        select: '-author',
      })
      .sort({ createdAt: -1 })
      .lean();

    // Extract valid posts
    const validPosts = bookmarks.filter((b) => b.post != null).map((b) => b.post);

    // Get user votes on these posts
    const postIds = validPosts.map((p) => p._id);
    const votes = await Vote.find({
      user: req.user._id,
      targetType: 'post',
      targetId: { $in: postIds },
    }).lean();

    const votesMap = {};
    votes.forEach((v) => {
      votesMap[v.targetId.toString()] = v.direction;
    });

    const formatted = validPosts.map((post) => ({
      ...post,
      id: post._id.toString(),
      isBookmarked: true,
      userVote: votesMap[post._id.toString()] || null,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle bookmark status on a post
export const toggleBookmark = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post || post.isRemoved) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND',
      });
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      post: postId,
    });

    let isBookmarked = false;
    if (existingBookmark) {
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      isBookmarked = false;
    } else {
      await Bookmark.create({
        user: req.user._id,
        post: postId,
      });
      isBookmarked = true;
    }

    res.json({
      success: true,
      data: {
        postId,
        isBookmarked,
      },
      message: isBookmarked ? 'Post added to your bookmarks' : 'Post removed from bookmarks',
    });
  } catch (error) {
    next(error);
  }
};

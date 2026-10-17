import { Report } from '../models/Report.js';
import { Post } from '../models/Post.js';

// Submit a report for a post or comment
export const createReport = async (req, res, next) => {
  try {
    const { postId, reason, snippet, reportedItemType = 'post', details } = req.body;

    if (!postId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both postId and a valid report reason',
        code: 'MISSING_REPORT_FIELDS',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Target post not found',
        code: 'POST_NOT_FOUND',
      });
    }

    const report = await Report.create({
      post: postId,
      reportedItemType,
      reporter: req.user._id,
      reason,
      details: details ? details.trim() : '',
      snippet: snippet || post.content.substring(0, 100),
      status: 'pending',
    });

    // Increment flag count on post
    await Post.findByIdAndUpdate(postId, { $inc: { flagCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Report submitted to SecretSpace moderators. Thank you for protecting campus safety.',
      data: {
        id: report._id.toString(),
        status: 'pending',
      },
    });
  } catch (error) {
    next(error);
  }
};

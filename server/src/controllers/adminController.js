import { Report } from '../models/Report.js';
import { Post } from '../models/Post.js';
import { Poll } from '../models/Poll.js';
import { User } from '../models/User.js';

// Get all reports for the admin moderation queue
export const getReports = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;

    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate({
        path: 'post',
        select: 'content category authorPseudonym isRemoved upvotes commentCount',
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = reports.map((r) => ({
      id: r._id.toString(),
      postId: r.post ? r.post._id.toString() : null,
      postContent: r.post ? r.post.content : '(Removed post)',
      postAuthor: r.post ? r.post.authorPseudonym : 'Anonymous',
      reason: r.reason,
      reportedItemType: r.reportedItemType,
      snippet: r.snippet,
      status: r.status,
      timestamp: r.createdAt,
      details: r.details,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// Resolve a moderation report
export const resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'dismiss' | 'remove'

    if (!['dismiss', 'remove'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "dismiss" or "remove"',
        code: 'INVALID_ACTION',
      });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
        code: 'REPORT_NOT_FOUND',
      });
    }

    report.status = action === 'remove' ? 'content_removed' : 'dismissed';
    report.actionTakenBy = req.user._id;
    report.actionTakenAt = new Date();
    await report.save();

    if (action === 'remove' && report.post) {
      await Post.findByIdAndUpdate(report.post, { isRemoved: true });
    }

    res.json({
      success: true,
      message: action === 'remove' ? 'Content removed and report resolved' : 'Report dismissed',
      data: {
        id: report._id.toString(),
        status: report.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin overview statistics
export const getStats = async (req, res, next) => {
  try {
    const [totalPosts, pendingReports, activePolls, totalUsers, removedPosts] = await Promise.all([
      Post.countDocuments({ isRemoved: { $ne: true } }),
      Report.countDocuments({ status: 'pending' }),
      Poll.countDocuments({ status: 'active' }),
      User.countDocuments(),
      Post.countDocuments({ isRemoved: true }),
    ]);

    res.json({
      success: true,
      data: {
        totalPosts,
        pendingReports,
        activePolls,
        totalUsers,
        removedPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

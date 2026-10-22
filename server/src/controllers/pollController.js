import { Poll } from '../models/Poll.js';
import { Vote } from '../models/Vote.js';

// Get list of polls with user vote state
export const getPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find().select('-author').sort({ createdAt: -1 }).lean();

    let userVotedPollsMap = {};

    if (req.user) {
      const pollIds = polls.map((p) => p._id);
      const userVotes = await Vote.find({
        user: req.user._id,
        targetType: 'poll',
        targetId: { $in: pollIds },
      }).lean();

      userVotes.forEach((v) => {
        userVotedPollsMap[v.targetId.toString()] = v.optionId ? v.optionId.toString() : true;
      });
    }

    const formattedPolls = polls.map((poll) => {
      const userSelectedOption = userVotedPollsMap[poll._id.toString()] || null;
      return {
        ...poll,
        id: poll._id.toString(),
        hasVoted: Boolean(userSelectedOption),
        userSelectedOption,
        options: (poll.options || []).map((opt) => ({
          ...opt,
          id: opt._id.toString(),
        })),
      };
    });

    res.json({
      success: true,
      data: formattedPolls,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new campus poll
export const createPoll = async (req, res, next) => {
  try {
    const { question, options, collegeTag } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Poll question cannot be empty',
        code: 'EMPTY_QUESTION',
      });
    }

    if (!Array.isArray(options) || options.length < 2 || options.length > 6) {
      return res.status(400).json({
        success: false,
        message: 'Poll must have between 2 and 6 options',
        code: 'INVALID_OPTIONS_COUNT',
      });
    }

    const formattedOptions = options.map((optText) => ({
      text: typeof optText === 'string' ? optText.trim() : optText.text.trim(),
      votes: 0,
    }));

    const poll = await Poll.create({
      question: question.trim(),
      options: formattedOptions,
      collegeTag: collegeTag || req.user.collegeTag || 'Campus Pulse',
      author: req.user._id,
      authorPseudonym: `${req.user.pseudonym} (You)`,
      totalVotes: 0,
      status: 'active',
    });

    const responsePoll = poll.toObject();
    delete responsePoll.author;

    res.status(201).json({
      success: true,
      data: {
        ...responsePoll,
        id: responsePoll._id.toString(),
        hasVoted: false,
        userSelectedOption: null,
        options: responsePoll.options.map((opt) => ({
          ...opt,
          id: opt._id.toString(),
        })),
      },
      message: 'Anonymous campus poll created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Vote on a poll
export const votePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify an optionId to cast your vote',
        code: 'MISSING_OPTION_ID',
      });
    }

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
        code: 'POLL_NOT_FOUND',
      });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      user: req.user._id,
      targetType: 'poll',
      targetId: id,
    });

    if (existingVote) {
      return res.status(409).json({
        success: false,
        message: 'You have already voted in this anonymous poll',
        code: 'ALREADY_VOTED',
      });
    }

    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found in this poll',
        code: 'OPTION_NOT_FOUND',
      });
    }

    // Record vote
    await Vote.create({
      user: req.user._id,
      targetType: 'poll',
      targetId: id,
      optionId,
    });

    // Increment vote tally
    option.votes += 1;
    poll.totalVotes += 1;
    await poll.save();

    res.json({
      success: true,
      data: {
        id: poll._id.toString(),
        hasVoted: true,
        userSelectedOption: optionId,
        totalVotes: poll.totalVotes,
        options: poll.options.map((opt) => ({
          id: opt._id.toString(),
          text: opt.text,
          votes: opt.votes,
        })),
      },
      message: 'Vote cast anonymously!',
    });
  } catch (error) {
    next(error);
  }
};

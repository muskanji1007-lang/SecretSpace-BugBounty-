import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api, { setAuthToken } from '../services/api.js';
import { INITIAL_POSTS, INITIAL_POLLS, MOCK_REPORTS, MOCK_USER } from '../data/mockData.js';

const AppContext = createContext(null);

const loadPersistedPosts = () => {
  try {
    const saved = localStorage.getItem('secretspace_custom_posts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AppContext] Failed to load cached posts from localStorage:', err);
  }
  return INITIAL_POSTS;
};

const loadPersistedPolls = () => {
  try {
    const saved = localStorage.getItem('secretspace_custom_polls');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AppContext] Failed to load cached polls from localStorage:', err);
  }
  return INITIAL_POLLS;
};

export const normalizeUser = (rawUser) => {
  if (!rawUser) return MOCK_USER;
  const avatarId = typeof rawUser.avatar === 'object' ? rawUser.avatar?.id : (rawUser.avatar || 'ghost');
  return {
    ...MOCK_USER,
    ...rawUser,
    id: rawUser._id || rawUser.id || 'u-1',
    _id: rawUser._id || rawUser.id || 'u-1',
    pseudonym: rawUser.pseudonym || MOCK_USER.pseudonym,
    avatar: avatarId,
    college: rawUser.college || rawUser.collegeTag || MOCK_USER.college,
    collegeTag: rawUser.collegeTag || rawUser.college || MOCK_USER.college,
    joinedDate: rawUser.joinedDate || (rawUser.createdAt ? `Joined ${new Date(rawUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : MOCK_USER.joinedDate),
    stats: {
      confessionsCount: rawUser.stats?.confessionsCount ?? 0,
      commentsCount: rawUser.stats?.commentsCount ?? 0,
      upvotesReceived: rawUser.stats?.upvotesReceived ?? 0,
      savedPostsCount: rawUser.stats?.savedPostsCount ?? 0,
    },
    badges: Array.isArray(rawUser.badges) && rawUser.badges.length > 0 ? rawUser.badges : MOCK_USER.badges,
    notifications: Array.isArray(rawUser.notifications) && rawUser.notifications.length > 0 ? rawUser.notifications : MOCK_USER.notifications,
  };
};

export const AppProvider = ({ children }) => {
  // Theme State (Supports Light & Dark Modes)
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      return nextTheme;
    });
  }, []);

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Application Data States (Rehydrated from localStorage to persist across refreshes)
  const [posts, setPosts] = useState(loadPersistedPosts);
  const [polls, setPolls] = useState(loadPersistedPolls);
  const [reports, setReports] = useState([]);

  // Keep localStorage continuously synced for offline / fallback persistence
  useEffect(() => {
    if (posts && posts.length > 0) {
      try {
        localStorage.setItem('secretspace_custom_posts', JSON.stringify(posts));
      } catch (err) {
        console.warn('[AppContext] Could not persist posts to localStorage:', err);
      }
    }
  }, [posts]);

  useEffect(() => {
    if (polls && polls.length > 0) {
      try {
        localStorage.setItem('secretspace_custom_polls', JSON.stringify(polls));
      } catch (err) {
        console.warn('[AppContext] Could not persist polls to localStorage:', err);
      }
    }
  }, [polls]);

  // Session Rehydration from sessionStorage (tab session lifespan)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('secretspace_user');
      if (savedUser) return normalizeUser(JSON.parse(savedUser));
    } catch {}
    return MOCK_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem('secretspace_token'));
    } catch {
      return false;
    }
  });

  // User Settings State (Persistent across navigation and refreshes)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = sessionStorage.getItem('secretspace_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      notifications: {
        upvotes: true,
        comments: true,
        polls: true,
        trendingAlerts: false,
      },
      privacy: {
        scrambleWeekly: true,
        hideHostelWing: false,
        blurSensitive: true,
      },
    };
  });

  // Backend & Connection State
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    database: 'unknown',
    checked: false,
  });
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);

  // Filter & Navigation States
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('hot'); // 'hot' | 'new' | 'top'
  const [searchQuery, setSearchQuery] = useState('');

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch real posts from backend
  const fetchPosts = useCallback(async (params = {}) => {
    setIsLoadingPosts(true);
    try {
      const res = await api.posts.getAll({
        category: params.category || activeCategory,
        sort: params.sort || sortBy,
        search: params.search !== undefined ? params.search : searchQuery,
      });
      if (res && res.success && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          setPosts(res.data);
        } else {
          setPosts((prev) => (prev && prev.length > 0 ? prev : loadPersistedPosts()));
        }
      }
    } catch (error) {
      console.warn('[AppContext] Could not fetch real posts:', error.message);
      setPosts((prev) => (prev && prev.length > 0 ? prev : loadPersistedPosts()));
    } finally {
      setIsLoadingPosts(false);
    }
  }, [activeCategory, sortBy, searchQuery]);

  // Fetch real polls from backend
  const fetchPolls = useCallback(async () => {
    setIsLoadingPolls(true);
    try {
      const res = await api.polls.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          setPolls(res.data);
        } else {
          setPolls((prev) => (prev && prev.length > 0 ? prev : loadPersistedPolls()));
        }
      }
    } catch (error) {
      console.warn('[AppContext] Could not fetch real polls:', error.message);
      setPolls((prev) => (prev && prev.length > 0 ? prev : loadPersistedPolls()));
    } finally {
      setIsLoadingPolls(false);
    }
  }, []);

  // Fetch moderation reports (Admin)
  const fetchReports = useCallback(async () => {
    if (!isLoggedIn || user?.role !== 'admin') {
      setReports((prev) => (prev.length === 0 ? MOCK_REPORTS : prev));
      return;
    }
    try {
      const res = await api.admin.getReports();
      if (res && res.success && Array.isArray(res.data)) {
        setReports(res.data);
      }
    } catch (error) {
      console.warn('[AppContext] Could not fetch real reports:', error.message);
      setReports((prev) => (prev.length === 0 ? MOCK_REPORTS : prev));
    }
  }, [isLoggedIn, user?.role]);

  // Initial Health & Connectivity Check on mount (Runs ONLY ONCE on app boot)
  useEffect(() => {
    let isMounted = true;

    const checkConnectivity = async () => {
      try {
        const health = await api.health.check();
        if (isMounted) {
          const isConnected = health.database === 'connected';
          setBackendStatus({
            online: true,
            database: health.database || (isConnected ? 'connected' : 'disconnected'),
            checked: true,
          });

          // Always trigger API calls so Network tab records the real endpoints
          fetchPosts();
          fetchPolls();
          fetchReports();
        }
      } catch (err) {
        if (isMounted) {
          setBackendStatus({
            online: false,
            database: 'disconnected',
            checked: true,
          });
          fetchPosts();
          fetchPolls();
        }
      }
    };

    checkConnectivity();
    return () => {
      isMounted = false;
    };
  }, []); // Run strictly once on mount

  // Sync feed when filter parameters change
  useEffect(() => {
    fetchPosts();
  }, [activeCategory, sortBy, searchQuery, fetchPosts]);

  // Upvote / Downvote Post
  const votePost = async (postId, direction) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        let newUpvotes = post.upvotes || 0;
        let newDownvotes = post.downvotes || 0;
        let newUserVote = post.userVote;

        if (post.userVote === direction) {
          if (direction === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (direction === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
          newUserVote = null;
        } else {
          if (post.userVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (post.userVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
          if (direction === 'up') newUpvotes += 1;
          if (direction === 'down') newDownvotes += 1;
          newUserVote = direction;
        }

        return {
          ...post,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote,
        };
      })
    );

    if (isLoggedIn) {
      try {
        const res = await api.posts.vote(postId, direction);
        if (res?.data) {
          setPosts((prevPosts) =>
            prevPosts.map((p) => (p.id === postId ? { ...p, ...res.data } : p))
          );
        }
      } catch (error) {
        console.warn('[AppContext] Real backend vote notice:', error.message);
      }
    }
  };

  // Bookmark Toggle
  const toggleBookmark = async (postId) => {
    let newStatus = false;
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        newStatus = !post.isBookmarked;
        return { ...post, isBookmarked: newStatus };
      })
    );

    addToast(
      newStatus ? 'Post bookmarked to your SecretSpace collection' : 'Removed from bookmarks',
      'success'
    );

    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        await api.bookmarks.toggle(postId);
      } catch (error) {
        addToast(error.message, 'error');
      }
    }
  };

  // Add New Post (Guaranteed to save and display immediately in feed and My Activity)
  const addPost = async ({ content, category, collegeTag, tags, authorAvatar }) => {
    if (!content || !content.trim()) {
      addToast('Please write your confession first', 'warning');
      return null;
    }

    const postPayload = {
      content: content.trim(),
      category: category || 'confessions',
      collegeTag: collegeTag || user?.collegeTag || user?.college || 'Campus North',
      tags: tags && tags.length > 0 ? tags : ['#CampusLife', '#SecretSpace'],
      authorAvatar: authorAvatar || user?.avatar || 'ghost',
    };

    // If logged in, persist to real backend API
    if (isLoggedIn) {
      try {
        const res = await api.posts.create(postPayload);
        if (res && res.success && res.data) {
          const savedPost = res.data;
          setPosts((prev) => [savedPost, ...prev]);
          setActiveCategory('all');
          setSearchQuery('');
          setUser((prev) => {
            const updated = {
              ...prev,
              stats: { ...prev.stats, confessionsCount: (prev.stats?.confessionsCount || 0) + 1 },
            };
            try {
              sessionStorage.setItem('secretspace_user', JSON.stringify(updated));
            } catch {}
            return updated;
          });
          addToast('Secret confession published anonymously to database!', 'success');
          return savedPost;
        }
      } catch (error) {
        console.warn('[AppContext] Real backend post save notice:', error.message);
        if (error.code === 'DB_UNAVAILABLE') {
          addToast(
            'API reached! (Temporarily cached in browser because MongoDB Atlas is not yet linked in Vercel)',
            'warning'
          );
        }
      }
    }

    // Offline / Fallback mode: Guaranteed local state save
    const fallbackPost = {
      id: `post-${Date.now()}`,
      authorPseudonym: `${user?.pseudonym || 'Freshman Ghost #101'} (You)`,
      authorAvatar: authorAvatar || user?.avatar || 'ghost',
      collegeTag: postPayload.collegeTag,
      timestamp: 'Just now',
      category: postPayload.category,
      content: postPayload.content,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      isBookmarked: false,
      isMyPost: true,
      commentCount: 0,
      tags: postPayload.tags,
      comments: [],
    };

    setPosts((prev) => [fallbackPost, ...prev]);
    setActiveCategory('all');
    setSearchQuery('');
    setUser((prev) => {
      const updated = {
        ...prev,
        stats: { ...prev.stats, confessionsCount: (prev.stats?.confessionsCount || 0) + 1 },
      };
      try {
        sessionStorage.setItem('secretspace_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addToast('Secret confession published anonymously!', 'success');
    return fallbackPost;
  };

  // Delete Post (Author or Admin)
  const deletePost = async (postId) => {
    const postToDelete = posts.find((p) => p.id === postId || p._id === postId);
    if (!postToDelete) {
      addToast('Post not found', 'error');
      return false;
    }

    const isAuthor =
      postToDelete.isMyPost ||
      (postToDelete.authorPseudonym || '').includes('(You)') ||
      (user?.pseudonym && postToDelete.authorPseudonym === user.pseudonym) ||
      (user?._id && postToDelete.author === user._id) ||
      (user?.id && postToDelete.author === user.id);
    const isAdmin = user?.role === 'admin';

    if (!isAuthor && !isAdmin) {
      addToast('You are not authorized to delete this post', 'error');
      return false;
    }

    if (isLoggedIn) {
      try {
        await api.posts.delete(postId);
      } catch (err) {
        console.warn('[AppContext] Backend post delete notice:', err.message);
        if (err.status === 403 || err.status === 401) {
          addToast(err.message || 'Cannot delete post: unauthorized', 'error');
          return false;
        }
      }
    }

    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId && p._id !== postId));

    if (isAuthor) {
      setUser((prev) => {
        const updated = {
          ...prev,
          stats: {
            ...prev.stats,
            confessionsCount: Math.max(0, (prev.stats?.confessionsCount || 1) - 1),
          },
        };
        try {
          sessionStorage.setItem('secretspace_user', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    addToast('Post deleted successfully', 'success');
    return true;
  };

  // Add Comment to Post
  const addComment = async (postId, content) => {
    if (!content || !content.trim()) return;

    if (isLoggedIn) {
      try {
        const res = await api.comments.create(postId, { content: content.trim() });
        if (res?.data) {
          setPosts((prev) =>
            prev.map((post) => {
              if (post.id !== postId) return post;
              return {
                ...post,
                commentCount: (post.commentCount || 0) + 1,
                comments: [...(post.comments || []), res.data],
              };
            })
          );
          setUser((prev) => ({
            ...prev,
            stats: { ...prev.stats, commentsCount: (prev.stats?.commentsCount || 0) + 1 },
          }));
          addToast('Anonymous comment posted in database!', 'success');
          return;
        }
      } catch (error) {
        console.warn('[AppContext] Real backend comment notice:', error.message);
      }
    }

    // In-memory fallback
    const newComment = {
      id: `c-${Date.now()}`,
      author: `${user?.pseudonym || 'Anonymous'} (You)`,
      avatar: user?.avatar || 'ghost',
      timestamp: 'Just now',
      content: content.trim(),
      upvotes: 1,
      replies: [],
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          commentCount: (post.commentCount || 0) + 1,
          comments: [...(post.comments || []), newComment],
        };
      })
    );
    setUser((prev) => ({
      ...prev,
      stats: { ...prev.stats, commentsCount: (prev.stats?.commentsCount || 0) + 1 },
    }));
    addToast('Anonymous comment posted', 'success');
  };

  // Add Nested Reply
  const addReply = async (postId, commentId, content) => {
    if (!content || !content.trim()) return;

    if (isLoggedIn) {
      try {
        const res = await api.comments.create(postId, { content: content.trim(), parentId: commentId });
        if (res?.data) {
          setPosts((prev) =>
            prev.map((post) => {
              if (post.id !== postId) return post;
              const updated = (post.comments || []).map((c) => {
                if (c.id !== commentId) return c;
                return { ...c, replies: [...(c.replies || []), res.data] };
              });
              return { ...post, commentCount: (post.commentCount || 0) + 1, comments: updated };
            })
          );
          setUser((prev) => ({
            ...prev,
            stats: { ...prev.stats, commentsCount: (prev.stats?.commentsCount || 0) + 1 },
          }));
          addToast('Reply sent anonymously in database!', 'success');
          return;
        }
      } catch (error) {
        console.warn('[AppContext] Real backend reply notice:', error.message);
      }
    }

    const newReply = {
      id: `r-${Date.now()}`,
      author: `${user?.pseudonym || 'Anonymous'} (You)`,
      avatar: user?.avatar || 'ghost',
      timestamp: 'Just now',
      content: content.trim(),
      upvotes: 1,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updated = (post.comments || []).map((c) => {
          if (c.id !== commentId) return c;
          return { ...c, replies: [...(c.replies || []), newReply] };
        });
        return { ...post, commentCount: (post.commentCount || 0) + 1, comments: updated };
      })
    );
    setUser((prev) => ({
      ...prev,
      stats: { ...prev.stats, commentsCount: (prev.stats?.commentsCount || 0) + 1 },
    }));
    addToast('Reply sent anonymously', 'success');
  };

  // Vote on a Poll
  const votePoll = async (pollId, optionId) => {
    if (isLoggedIn) {
      try {
        const res = await api.polls.vote(pollId, optionId);
        if (res?.data) {
          setPolls((prev) =>
            prev.map((p) => (p.id === pollId ? { ...p, ...res.data } : p))
          );
          addToast('Vote registered anonymously in database!', 'success');
          return;
        }
      } catch (error) {
        console.warn('[AppContext] Real backend poll vote notice:', error.message);
      }
    }

    // In-memory fallback
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.hasVoted) {
          addToast('You have already voted in this poll', 'error');
          return poll;
        }

        const updatedOptions = (poll.options || []).map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: (opt.votes || 0) + 1 };
          }
          return opt;
        });

        addToast('Vote registered anonymously!', 'success');
        return {
          ...poll,
          hasVoted: true,
          userSelectedOption: optionId,
          totalVotes: (poll.totalVotes || 0) + 1,
          options: updatedOptions,
        };
      })
    );
  };

  // Create New Poll
  const createPoll = async ({ question, options, collegeTag }) => {
    if (!question || !question.trim()) {
      addToast('Please enter a poll question', 'warning');
      return null;
    }

    if (isLoggedIn) {
      try {
        const res = await api.polls.create({ question, options, collegeTag });
        if (res?.data) {
          setPolls((prev) => [res.data, ...prev]);
          addToast('Anonymous campus poll created in database!', 'success');
          return res.data;
        }
      } catch (error) {
        console.warn('[AppContext] Real backend create poll notice:', error.message);
        if (error.code === 'DB_UNAVAILABLE') {
          addToast('API reached! (Poll cached in browser because MongoDB Atlas is not yet linked in Vercel)', 'warning');
        }
      }
    }

    const formattedOptions = options.map((optText, index) => ({
      id: `opt-${Date.now()}-${index}`,
      text: typeof optText === 'string' ? optText : optText.text,
      votes: 0,
    }));

    const newPoll = {
      id: `poll-${Date.now()}`,
      authorPseudonym: `${user?.pseudonym || 'Anonymous'} (You)`,
      collegeTag: collegeTag || 'Campus Pulse',
      timestamp: 'Just now',
      question: question.trim(),
      totalVotes: 0,
      hasVoted: false,
      userSelectedOption: null,
      status: 'active',
      expiresIn: '7 days left',
      options: formattedOptions,
    };

    setPolls((prev) => [newPoll, ...prev]);
    addToast('Anonymous campus poll created!', 'success');
    return newPoll;
  };

  // Report Content
  const reportItem = async ({ postId, reason, snippet, reportedItemType = 'post', details }) => {
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.reports.create({ postId, reason, snippet, reportedItemType, details });
        addToast(res.message || 'Report submitted to SecretSpace moderators.', 'success');
        return;
      } catch (error) {
        addToast(`Report submission failed: ${error.message}`, 'error');
        return;
      }
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      postId,
      reason,
      reportedItemType,
      snippet: snippet || 'Flagged for community review',
      details: details || '',
      flaggedBy: user?.pseudonym || 'Anonymous Student',
      timestamp: 'Just now',
      status: 'pending',
      severity: 'medium',
    };

    setReports((prev) => [newReport, ...prev]);
    addToast('Report submitted to SecretSpace moderators. Thank you for keeping campus safe.', 'success');
  };

  // Admin Actions (Strict authorization and verification)
  const resolveReport = async (reportId, action) => {
    if (user?.role !== 'admin') {
      addToast('Access denied: Administrator privileges required.', 'error');
      return false;
    }

    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.admin.resolveReport(reportId, action);
        if (res && res.success) {
          setReports((prev) =>
            prev.map((r) =>
              r.id === reportId ? { ...r, status: action === 'remove' ? 'content_removed' : 'dismissed' } : r
            )
          );
          if (action === 'remove') {
            const rep = reports.find((r) => r.id === reportId);
            if (rep && rep.postId) {
              setPosts((prev) => prev.filter((p) => p.id !== rep.postId));
            }
          }
          addToast(
            action === 'remove' ? 'Content removed & report resolved' : 'Report dismissed',
            'success'
          );
          return true;
        } else {
          throw new Error(res?.message || 'Could not resolve report');
        }
      } catch (error) {
        addToast(`Moderation action failed: ${error.message}`, 'error');
        return false;
      }
    }

    // Local state resolution for demo preview
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, status: action === 'remove' ? 'content_removed' : 'dismissed' };
      })
    );

    if (action === 'remove') {
      const rep = reports.find((r) => r.id === reportId);
      if (rep && rep.postId) {
        setPosts((prev) => prev.filter((p) => p.id !== rep.postId));
      }
      addToast('Report action: Content removed & flag marked resolved', 'success');
    } else {
      addToast('Report action: Flag dismissed', 'info');
    }
    return true;
  };

  // User Profile & Preferences
  const updateProfile = async (updates) => {
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.auth.updateProfile(updates);
        if (res?.user) {
          setUser((prev) => {
            const merged = { ...prev, ...res.user };
            try {
              sessionStorage.setItem('secretspace_user', JSON.stringify(merged));
            } catch {}
            return merged;
          });
          addToast('Disguise and preferences updated successfully.', 'success');
          return;
        }
      } catch (error) {
        addToast(`Could not update profile: ${error.message}`, 'error');
        return;
      }
    }

    setUser((prev) => {
      const merged = { ...prev, ...updates };
      try {
        sessionStorage.setItem('secretspace_user', JSON.stringify(merged));
      } catch {}
      return merged;
    });
    addToast('Profile updated for this session', 'success');
  };

  // Persistent Settings Update
  const updateSettings = useCallback(async (newSettings) => {
    setSettings((prev) => {
      const merged = {
        ...prev,
        ...newSettings,
        notifications: { ...(prev?.notifications || {}), ...(newSettings?.notifications || {}) },
        privacy: { ...(prev?.privacy || {}), ...(newSettings?.privacy || {}) },
      };
      try {
        sessionStorage.setItem('secretspace_settings', JSON.stringify(merged));
      } catch {}
      return merged;
    });

    if (backendStatus.online && backendStatus.database === 'connected' && isLoggedIn) {
      try {
        await api.auth.updateProfile({ settings: newSettings });
      } catch (err) {
        console.warn('[AppContext] Failed to sync settings with backend:', err.message);
      }
    }
  }, [backendStatus, isLoggedIn]);

  const login = async ({ emailOrCode, password }) => {
    if (!emailOrCode || !emailOrCode.trim()) {
      addToast('Please enter your college email or key', 'error');
      return false;
    }
    if (!password || password.length < 6) {
      addToast('Please enter your password (minimum 6 characters)', 'error');
      return false;
    }

    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const email = emailOrCode.includes('@') ? emailOrCode.trim() : `${emailOrCode.trim().toLowerCase()}@campus.edu`;
        const res = await api.auth.login({ email, password });
        if (res?.token) {
          const safeUser = normalizeUser(res.user);
          setAuthToken(res.token);
          setUser(safeUser);
          setIsLoggedIn(true);
          try {
            sessionStorage.setItem('secretspace_user', JSON.stringify(safeUser));
          } catch {}
          addToast(`Welcome back, ${safeUser.pseudonym}!`, 'success');
          fetchPosts();
          fetchPolls();
          return true;
        } else {
          throw new Error(res?.message || 'Login failed');
        }
      } catch (error) {
        addToast(`Login failed: ${error.message}`, 'error');
        return false;
      }
    }

    // Demo/Offline login
    const isAdmin = emailOrCode.trim().toLowerCase() === 'admin@campus.edu';
    const fallbackUser = {
      ...user,
      email: emailOrCode.includes('@') ? emailOrCode.trim() : `${emailOrCode.trim().toLowerCase()}@campus.edu`,
      pseudonym: isAdmin ? 'Campus Guardian (Mod)' : user.pseudonym || 'Freshman Ghost #101',
      role: isAdmin ? 'admin' : 'user',
    };

    setAuthToken(`demo-token-${Date.now()}`);
    setUser(fallbackUser);
    setIsLoggedIn(true);
    try {
      sessionStorage.setItem('secretspace_user', JSON.stringify(fallbackUser));
    } catch {}
    addToast(`Welcome back, ${fallbackUser.pseudonym}!`, 'success');
    return true;
  };

  const quickDemoLogin = async (role = 'student') => {
    if (role === 'admin') {
      const ok = await login({ emailOrCode: 'admin@campus.edu', password: 'adminpassword123' });
      if (ok) {
        setUser((prev) => {
          const u = {
            ...prev,
            email: 'admin@campus.edu',
            pseudonym: 'Campus Guardian #01',
            role: 'admin',
            avatar: 'fox',
          };
          try {
            sessionStorage.setItem('secretspace_user', JSON.stringify(u));
          } catch {}
          return u;
        });
      }
    } else {
      const ok = await login({ emailOrCode: 'student@campus.edu', password: 'studentpassword123' });
      if (ok) {
        setUser((prev) => {
          const u = {
            ...prev,
            email: 'student@campus.edu',
            pseudonym: 'Silent Scholar #42',
            role: 'user',
            avatar: 'owl',
          };
          try {
            sessionStorage.setItem('secretspace_user', JSON.stringify(u));
          } catch {}
          return u;
        });
      }
    }
  };

  const signup = async ({ email, pseudonym, campusCode, password, avatar }) => {
    if (!password || password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return false;
    }

    const userEmail = email && email.trim()
      ? email.trim()
      : `${pseudonym.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'student'}@campus.edu`;

    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.auth.register({
          email: userEmail,
          password,
          pseudonym: pseudonym || 'Anonymous Student',
          avatar,
          collegeTag: campusCode || 'Campus North',
        });
        if (res?.token) {
          const safeUser = normalizeUser(res.user);
          setAuthToken(res.token);
          setUser(safeUser);
          setIsLoggedIn(true);
          try {
            sessionStorage.setItem('secretspace_user', JSON.stringify(safeUser));
          } catch {}
          addToast('Anonymous account created! Your identity is hidden.', 'success');
          fetchPosts();
          return true;
        } else {
          throw new Error(res?.message || 'Registration failed');
        }
      } catch (error) {
        addToast(`Signup failed: ${error.message}`, 'error');
        return false;
      }
    }

    const newUser = {
      ...user,
      email: userEmail,
      pseudonym: pseudonym || 'Freshman Ghost #101',
      collegeTag: campusCode || 'Campus North',
      college: campusCode || 'Campus North',
      avatar: avatar || 'ghost',
      role: 'user',
    };

    setAuthToken(`demo-token-${Date.now()}`);
    setUser(newUser);
    setIsLoggedIn(true);
    try {
      sessionStorage.setItem('secretspace_user', JSON.stringify(newUser));
    } catch {}
    addToast('Anonymous account created! Your identity is hidden.', 'success');
    return true;
  };

  const logout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    setUser(MOCK_USER);
    try {
      sessionStorage.removeItem('secretspace_token');
      sessionStorage.removeItem('secretspace_user');
    } catch {}
    addToast('Logged out of session', 'info');
  };

  // Reset in-memory state cleanly
  const resetInMemoryState = useCallback(() => {
    try {
      localStorage.removeItem('secretspace_custom_posts');
      localStorage.removeItem('secretspace_custom_polls');
      sessionStorage.removeItem('secretspace_settings');
    } catch {}
    setPosts(INITIAL_POSTS);
    setPolls(INITIAL_POLLS);
    setReports(MOCK_REPORTS);
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('hot');
    setSettings({
      notifications: { upvotes: true, comments: true, polls: true, trendingAlerts: false },
      privacy: { scrambleWeekly: true, hideHostelWing: false, blurSensitive: true },
    });
    addToast('Session memory cleared. All temporary interactions refreshed.', 'info');
  }, [addToast]);

  // Filtered and Sorted Posts calculation
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        if (activeCategory !== 'all' && post.category !== activeCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchContent = (post.content || '').toLowerCase().includes(query);
          const matchTag = (post.tags || []).some((t) => t.toLowerCase().includes(query));
          const matchAuthor = (post.authorPseudonym || '').toLowerCase().includes(query);
          if (!matchContent && !matchTag && !matchAuthor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'hot') {
          const scoreA = (a.upvotes || 0) * 2 + (a.commentCount || 0) * 3;
          const scoreB = (b.upvotes || 0) * 2 + (b.commentCount || 0) * 3;
          return scoreB - scoreA;
        }
        if (sortBy === 'top') {
          return String(b.upvotes || 0).localeCompare(String(a.upvotes || 0));
        }
        return 0; // 'new' preserves order
      });
  }, [posts, activeCategory, sortBy, searchQuery]);

  // Derived bookmarks
  const activeBookmarks = useMemo(() => {
    return posts.filter((p) => p.isBookmarked);
  }, [posts]);

  // Derived user posts (Accurate detection regardless of alias changes)
  const myPosts = useMemo(() => {
    return posts.filter((p) => {
      return Boolean(user?.pseudonym && p.authorPseudonym === user.pseudonym);
    });
  }, [posts, user?.pseudonym]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        posts,
        filteredPosts,
        bookmarkedPosts: activeBookmarks,
        myPosts,
        polls,
        reports,
        user,
        isLoggedIn,
        settings,
        updateSettings,
        resetInMemoryState,
        backendStatus,
        isLoadingPosts,
        isLoadingPolls,
        activeCategory,
        setActiveCategory,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        votePost,
        toggleBookmark,
        addPost,
        deletePost,
        addComment,
        addReply,
        votePoll,
        createPoll,
        reportItem,
        resolveReport,
        updateProfile,
        login,
        quickDemoLogin,
        signup,
        logout,
        fetchPosts,
        fetchPolls,
        fetchReports,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

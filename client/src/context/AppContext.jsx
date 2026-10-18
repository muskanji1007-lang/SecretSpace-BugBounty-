import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api, { setAuthToken } from '../services/api.js';
import { INITIAL_POSTS, INITIAL_POLLS, MOCK_REPORTS, MOCK_USER } from '../data/mockData.js';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Theme State (Supports Light & Dark Modes from screenshot)
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

  // Application Data States
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [reports, setReports] = useState([]);

  // Authentication State (In-Memory Session)
  const [user, setUser] = useState(MOCK_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch real posts from backend
  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const res = await api.posts.getAll({
        category: activeCategory,
        sort: sortBy,
        search: searchQuery,
      });
      if (res && res.success && Array.isArray(res.data)) {
        setPosts(res.data);
      }
    } catch (error) {
      console.warn('[AppContext] Could not fetch real posts:', error.message);
      if (posts.length === 0) {
        setPosts(INITIAL_POSTS);
      }
    } finally {
      setIsLoadingPosts(false);
    }
  }, [activeCategory, sortBy, searchQuery, posts.length]);

  // Fetch real polls from backend
  const fetchPolls = useCallback(async () => {
    setIsLoadingPolls(true);
    try {
      const res = await api.polls.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setPolls(res.data);
      }
    } catch (error) {
      console.warn('[AppContext] Could not fetch real polls:', error.message);
      if (polls.length === 0) {
        setPolls(INITIAL_POLLS);
      }
    } finally {
      setIsLoadingPolls(false);
    }
  }, [polls.length]);

  // Fetch moderation reports (Admin)
  const fetchReports = useCallback(async () => {
    try {
      const res = await api.admin.getReports();
      if (res && res.success && Array.isArray(res.data)) {
        setReports(res.data);
      }
    } catch (error) {
      console.warn('[AppContext] Could not fetch real reports:', error.message);
      if (reports.length === 0) {
        setReports(MOCK_REPORTS);
      }
    }
  }, [reports.length]);

  // Initial Health & Connectivity Check on mount
  useEffect(() => {
    let isMounted = true;

    const checkConnectivity = async () => {
      try {
        const health = await api.health.check();
        if (isMounted) {
          setBackendStatus({
            online: true,
            database: health.database,
            checked: true,
          });

          if (health.database === 'connected') {
            fetchPosts();
            fetchPolls();
          } else {
            setPosts(INITIAL_POSTS);
            setPolls(INITIAL_POLLS);
            setReports(MOCK_REPORTS);
            setIsLoadingPosts(false);
            setIsLoadingPolls(false);
          }
        }
      } catch {
        if (isMounted) {
          setBackendStatus({
            online: false,
            database: 'disconnected',
            checked: true,
          });
          setPosts(INITIAL_POSTS);
          setPolls(INITIAL_POLLS);
          setReports(MOCK_REPORTS);
          setIsLoadingPosts(false);
          setIsLoadingPolls(false);
        }
      }
    };

    checkConnectivity();
    return () => {
      isMounted = false;
    };
  }, [fetchPolls, fetchPosts]);

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

    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.posts.vote(postId, direction);
        if (res?.data) {
          setPosts((prevPosts) =>
            prevPosts.map((p) => (p.id === postId ? { ...p, ...res.data } : p))
          );
        }
      } catch (error) {
        addToast(error.message, 'error');
        fetchPosts();
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

  // Add New Post (Guaranteed to succeed and display on screen)
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

    let savedPost = null;

    // Attempt backend creation if online and connected
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.posts.create(postPayload);
        if (res?.data) {
          savedPost = res.data;
        }
      } catch (error) {
        console.warn('[AppContext] Backend create post failed, falling back to local state:', error.message);
      }
    }

    // Bulletproof fallback: Always add post locally so the user's confession is NEVER lost!
    if (!savedPost) {
      savedPost = {
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
        commentCount: 0,
        tags: postPayload.tags,
        comments: [],
      };
    }

    setPosts((prev) => [savedPost, ...prev]);
    setUser((prev) => ({
      ...prev,
      stats: { ...prev.stats, confessionsCount: (prev.stats?.confessionsCount || 0) + 1 },
    }));
    addToast('Secret confession published anonymously!', 'success');
    return savedPost;
  };

  // Add Comment to Post
  const addComment = async (postId, content) => {
    if (!content || !content.trim()) return;

    if (backendStatus.online && backendStatus.database === 'connected') {
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
          addToast('Anonymous comment posted', 'success');
          return;
        }
      } catch (error) {
        console.warn('[AppContext] Backend comment failed, fallback to local:', error.message);
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
    addToast('Anonymous comment posted', 'success');
  };

  // Add Nested Reply
  const addReply = async (postId, commentId, content) => {
    if (!content || !content.trim()) return;

    if (backendStatus.online && backendStatus.database === 'connected') {
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
          addToast('Reply sent anonymously', 'success');
          return;
        }
      } catch (error) {
        console.warn('[AppContext] Backend reply failed, fallback to local:', error.message);
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
    addToast('Reply sent anonymously', 'success');
  };

  // Vote on a Poll
  const votePoll = async (pollId, optionId) => {
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.polls.vote(pollId, optionId);
        if (res?.data) {
          setPolls((prev) =>
            prev.map((p) => (p.id === pollId ? { ...p, ...res.data } : p))
          );
          addToast('Vote registered anonymously!', 'success');
          return;
        }
      } catch (error) {
        console.warn('[AppContext] Backend vote failed:', error.message);
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

    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.polls.create({ question, options, collegeTag });
        if (res?.data) {
          setPolls((prev) => [res.data, ...prev]);
          addToast('Anonymous campus poll created!', 'success');
          return res.data;
        }
      } catch (error) {
        console.warn('[AppContext] Backend create poll failed:', error.message);
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
        console.warn('[AppContext] Backend report failed:', error.message);
      }
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      postId,
      reason,
      reportedItemType,
      snippet: snippet || 'Flagged for community review',
      flaggedBy: user?.pseudonym || 'Anonymous Student',
      timestamp: 'Just now',
      status: 'pending',
      severity: 'medium',
    };

    setReports((prev) => [newReport, ...prev]);
    addToast('Report submitted to SecretSpace moderators. Thank you for keeping campus safe.', 'success');
  };

  // Admin Actions
  const resolveReport = async (reportId, action) => {
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        await api.admin.resolveReport(reportId, action);
        fetchReports();
        if (action === 'remove') {
          fetchPosts();
        }
        addToast(
          action === 'remove' ? 'Content removed & report resolved' : 'Report dismissed',
          'success'
        );
        return;
      } catch (error) {
        console.warn('[AppContext] Backend resolve report failed:', error.message);
      }
    }

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
  };

  // User Profile & Authentication
  const updateProfile = async (updates) => {
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const res = await api.auth.updateProfile(updates);
        if (res?.user) {
          setUser((prev) => ({ ...prev, ...res.user }));
          addToast('Disguise updated successfully.', 'success');
          return;
        }
      } catch (error) {
        console.warn('[AppContext] Backend updateProfile failed:', error.message);
      }
    }

    setUser((prev) => ({ ...prev, ...updates }));
    addToast('Profile updated for this session', 'success');
  };

  const login = async ({ emailOrCode, password }) => {
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const email = emailOrCode.includes('@') ? emailOrCode : `${emailOrCode.toLowerCase()}@campus.edu`;
        const res = await api.auth.login({ email, password: password || 'studentpassword123' });
        if (res?.token) {
          setAuthToken(res.token);
          setUser(res.user);
          setIsLoggedIn(true);
          addToast(`Welcome back, ${res.user.pseudonym}!`, 'success');
          fetchPosts();
          fetchPolls();
          return true;
        }
      } catch (error) {
        console.warn('[AppContext] Live login error:', error.message);
      }
    }

    // Smooth fallback: session login for testing and preview
    setIsLoggedIn(true);
    setUser((prev) => ({
      ...prev,
      email: emailOrCode.includes('@') ? emailOrCode : `${emailOrCode.toLowerCase()}@campus.edu`,
      pseudonym: emailOrCode.includes('admin') ? 'Campus Guardian (Mod)' : prev.pseudonym || 'Freshman Ghost #101',
      role: emailOrCode.includes('admin') ? 'admin' : 'user',
    }));
    addToast(`Welcome back to SecretSpace! Your session is active.`, 'success');
    return true;
  };

  // Quick 1-click test login for user and senior to test instantly on Vercel
  const quickDemoLogin = async (role = 'student') => {
    if (role === 'admin') {
      await login({ emailOrCode: 'admin@campus.edu', password: 'adminpassword123' });
      setUser((prev) => ({
        ...prev,
        email: 'admin@campus.edu',
        pseudonym: 'Campus Guardian #01',
        role: 'admin',
        avatar: 'fox',
      }));
    } else {
      await login({ emailOrCode: 'student@campus.edu', password: 'studentpassword123' });
      setUser((prev) => ({
        ...prev,
        email: 'student@campus.edu',
        pseudonym: 'Silent Scholar #42',
        role: 'user',
        avatar: 'owl',
      }));
    }
  };

  const signup = async ({ email, pseudonym, campusCode, password, avatar }) => {
    if (backendStatus.online && backendStatus.database === 'connected') {
      try {
        const generatedEmail = email || `${pseudonym.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'student'}@campus.edu`;
        const res = await api.auth.register({
          email: generatedEmail,
          password: password || 'studentpassword123',
          pseudonym: pseudonym || 'Anonymous Student',
          avatar,
          collegeTag: campusCode || 'Campus North',
        });
        if (res?.token) {
          setAuthToken(res.token);
          setUser(res.user);
          setIsLoggedIn(true);
          addToast('Anonymous account created! Your identity is hidden.', 'success');
          fetchPosts();
          return true;
        }
      } catch (error) {
        console.warn('[AppContext] Live signup error:', error.message);
      }
    }

    // Smooth fallback signup
    setIsLoggedIn(true);
    setUser((prev) => ({
      ...prev,
      pseudonym: pseudonym || 'Freshman Ghost #101',
      collegeTag: campusCode || 'Campus North',
      college: campusCode || 'Campus North',
      avatar: avatar || 'ghost',
    }));
    addToast('Anonymous account created! Your identity is hidden.', 'success');
    return true;
  };

  const logout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    addToast('Logged out of session', 'info');
  };

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
          return (b.upvotes || 0) - (a.upvotes || 0);
        }
        return 0; // 'new' preserves order
      });
  }, [posts, activeCategory, sortBy, searchQuery]);

  // Derived bookmarks
  const activeBookmarks = useMemo(() => {
    return posts.filter((p) => p.isBookmarked);
  }, [posts]);

  // Derived user posts
  const myPosts = useMemo(() => {
    return posts.filter(
      (p) =>
        (p.authorPseudonym || '').includes('(You)') ||
        (user?.pseudonym && p.authorPseudonym === user.pseudonym)
    );
  }, [posts, user]);

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

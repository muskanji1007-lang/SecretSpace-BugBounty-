// SecretSpace Centralized API Client Layer
const resolveApiBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string') {
    let clean = envUrl.trim().replace(/\/$/, '');
    if (!clean.endsWith('/api')) {
      clean += '/api';
    }
    return clean;
  }

  // Smart production detection: When loaded from Vercel frontend, connect to Vercel backend by default
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('vercel.app') || window.location.protocol === 'https:')
  ) {
    return 'https://secret-space-6hvw.vercel.app/api';
  }

  return 'http://localhost:5000/api';
};

const API_BASE_URL = resolveApiBaseUrl();

// Ephemeral session token storage (lasts for browser tab session without permanent local database)
let inMemoryToken = null;

export const setAuthToken = (token) => {
  inMemoryToken = token;
  try {
    if (token) {
      sessionStorage.setItem('secretspace_token', token);
    } else {
      sessionStorage.removeItem('secretspace_token');
    }
  } catch {}
};

export const getAuthToken = () => {
  if (!inMemoryToken) {
    try {
      inMemoryToken = sessionStorage.getItem('secretspace_token');
    } catch {}
  }
  return inMemoryToken;
};

// Generic Fetch Wrapper
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const activeToken = getAuthToken();
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.code = data?.code || 'API_ERROR';
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkErr = new Error(
        `Unable to reach SecretSpace backend at ${API_BASE_URL}. Check network connection and API server status.`
      );
      networkErr.code = 'NETWORK_ERROR';
      throw networkErr;
    }
    throw error;
  }
};

export const api = {
  // Health
  health: {
    check: () => request('/health', { method: 'GET' }),
  },

  // Authentication & Profile
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => request('/auth/me', { method: 'GET' }),
    updateProfile: (updates) =>
      request('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  // Posts Feed & CRUD
  posts: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.sort) query.append('sort', params.sort);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/posts${queryString}`, { method: 'GET' });
    },
    getById: (id) => request(`/posts/${id}`, { method: 'GET' }),
    create: (postData) =>
      request('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      }),
    vote: (id, direction) =>
      request(`/posts/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ direction }),
      }),
    delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  },

  // Comments
  comments: {
    getByPost: (postId) => request(`/comments/${postId}`, { method: 'GET' }),
    create: (postId, commentData) =>
      request(`/comments/${postId}`, {
        method: 'POST',
        body: JSON.stringify(commentData),
      }),
  },

  // Polls
  polls: {
    getAll: () => request('/polls', { method: 'GET' }),
    create: (pollData) =>
      request('/polls', {
        method: 'POST',
        body: JSON.stringify(pollData),
      }),
    vote: (pollId, optionId) =>
      request(`/polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ optionId }),
      }),
  },

  // Bookmarks
  bookmarks: {
    getAll: () => request('/bookmarks', { method: 'GET' }),
    toggle: (postId) => request(`/bookmarks/${postId}`, { method: 'POST' }),
  },

  // User Activity
  users: {
    getActivity: () => request('/users/me/activity', { method: 'GET' }),
  },

  // Moderation Reports
  reports: {
    create: (reportData) =>
      request('/reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
      }),
  },

  // Admin Dashboard
  admin: {
    getReports: (status = 'pending') =>
      request(`/admin/reports?status=${status}`, { method: 'GET' }),
    resolveReport: (reportId, action) =>
      request(`/admin/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      }),
    getStats: () => request('/admin/stats', { method: 'GET' }),
  },
};

export default api;

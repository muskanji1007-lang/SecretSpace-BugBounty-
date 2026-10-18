import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import PollsPage from './pages/PollsPage.jsx';
import PostDetailsPage from './pages/PostDetailsPage.jsx';
import BookmarksPage from './pages/BookmarksPage.jsx';
import MyActivityPage from './pages/MyActivityPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

// Guard: User must be logged in to access the dashboard / campus feed
function ProtectedRoute() {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// Guard: If already logged in, redirect away from login / signup to home
function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useApp();
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes (Must login first) */}
          <Route
            path="login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Dashboard Routes (Opens only after login) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="polls" element={<PollsPage />} />
              <Route path="post/:id" element={<PostDetailsPage />} />
              <Route path="bookmarks" element={<BookmarksPage />} />
              <Route path="my-activity" element={<MyActivityPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

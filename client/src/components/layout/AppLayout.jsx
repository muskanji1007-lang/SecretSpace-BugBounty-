import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import RightSidebar from './RightSidebar.jsx';
import Navbar from './Navbar.jsx';
import MobileNav from './MobileNav.jsx';
import CreatePostModal from '../common/CreatePostModal.jsx';
import ToastContainer from '../common/ToastContainer.jsx';

export default function AppLayout() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-main flex flex-col">
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex justify-center pb-0 md:pb-6 overflow-x-hidden">
        {/* Left Navigation */}
        <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

        {/* Center Main Scrollable Area */}
        <main className="flex-1 max-w-2xl min-w-0 p-4 sm:p-6">
          <Outlet context={{ onOpenCreateModal: () => setIsCreateModalOpen(true) }} />
        </main>

        {/* Right Widgets */}
        <RightSidebar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Global Modals & Feedback */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
}

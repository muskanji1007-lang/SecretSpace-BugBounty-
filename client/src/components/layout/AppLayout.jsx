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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-main flex flex-col relative selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Aceternity / Techkriti Ambient Spotlight Mesh */}
      <div className="fixed inset-0 bg-tech-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-primary/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <div className="flex-1 max-w-7xl w-full mx-auto flex justify-center pb-0 md:pb-6 overflow-x-hidden">
          {/* Left Navigation (Desktop) */}
          <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

          {/* Center Main Scrollable Area */}
          <main className="flex-1 max-w-2xl min-w-0 p-3 sm:p-6 w-full">
            <Outlet context={{ onOpenCreateModal: () => setIsCreateModalOpen(true) }} />
          </main>

        {/* Right Widgets */}
        <RightSidebar />
      </div>

      {/* Mobile Collapsible Navigation Drawer */}
      {isMobileMenuOpen && (
        <Sidebar
          isMobileDrawer={true}
          onOpenCreateModal={() => {
            setIsMobileMenuOpen(false);
            setIsCreateModalOpen(true);
          }}
          onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNav onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Global Modals & Feedback */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <ToastContainer />
      </div>
    </div>
  );
}

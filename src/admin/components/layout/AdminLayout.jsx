import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import useAdminStore from '../../context/useAdminStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // Basic route protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/30 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
          <div 
              className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
          />
      )}

      {/* Desktop Sidebar - In Flow */}
      <div className="hidden lg:block shrink-0 relative z-50">
        <AdminSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

       {/* Mobile Sidebar - Fixed Overlay */}
       {sidebarOpen && (
          <AdminSidebar 
             isMobile={true} 
             onCloseMobile={() => setSidebarOpen(false)}
          />
       )}

      {/* Main Content Area - Flexible */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-x-hidden overflow-y-hidden relative z-10 transition-all duration-300">
        <AdminHeader onMobileMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto py-4 sm:py-6 lg:py-8 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
          <div className="max-w-full overflow-x-hidden px-3 sm:px-4 md:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

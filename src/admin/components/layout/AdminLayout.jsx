import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/admin/components/layout/AdminSidebar';
import AdminHeader from '@/admin/components/layout/AdminHeader';
import useDataStore from '@/store/useDataStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { isAuthenticated, currentUser } = useDataStore();
  const navigate = useNavigate();

  // Basic route protection
  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!isAuthenticated || currentUser?.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/30 relative overflow-hidden max-w-full">
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
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10 transition-all duration-300 max-w-full overflow-x-hidden">
        <AdminHeader onMobileMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 flex flex-col w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

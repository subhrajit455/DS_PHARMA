import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../ui/Navigation';
import Footer from '../sections/Footer';
import ScrollToTop from '../ui/ScrollToTop';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content Area - Pages render here via Outlet */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;

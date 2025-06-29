import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Only show footer on non-auth pages or conditionally style it */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout;
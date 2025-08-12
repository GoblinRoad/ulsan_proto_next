import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isCheckInPage = location.pathname.includes('/checkin/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {!isCheckInPage && <Header />}
      <main className={`${!isCheckInPage ? 'pt-16 pb-20' : ''} min-h-screen`}>
        {children}
      </main>
      {!isCheckInPage && <Navigation />}
    </div>
  );
};

export default Layout;
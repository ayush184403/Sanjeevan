import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main>
        {children}
      </main>
      
      {!isHome && (
         <footer className="bg-white border-t py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
               <p className="text-gray-400 text-sm">© 2024 Sanjeevan Initiative. Immediate Aid Network.</p>
            </div>
         </footer>
      )}
    </div>
  );
};

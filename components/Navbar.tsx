import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X, ShieldAlert, Users, Activity, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentUserRole, setRole } = useApp();
  const location = useLocation();

  const navLinks = [
    { name: 'Emergency', path: '/', icon: ShieldAlert },
    { name: 'Volunteer', path: '/volunteer', icon: Users },
    { name: 'Track', path: '/track', icon: Activity },
    { name: 'Admin', path: '/admin', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-emergency-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-emergency-600 p-2 rounded-lg text-white animate-pulse-fast">
                 <HeartPulse size={24} strokeWidth={3} />
              </div>
              <span className="font-black text-xl tracking-tight text-gray-900">
                SANJEEVAN
              </span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-emergency-600 bg-emergency-50'
                    : 'text-gray-600 hover:text-emergency-600 hover:bg-gray-50'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
            
            <div className="ml-4 border-l pl-4 border-gray-200">
               <select 
                 value={currentUserRole}
                 onChange={(e) => setRole(e.target.value as any)}
                 className="text-xs border rounded px-2 py-1 bg-gray-100 text-gray-600 focus:outline-none"
               >
                 <option value="CALLER">Role: Caller</option>
                 <option value="VOLUNTEER">Role: Volunteer</option>
                 <option value="ADMIN">Role: Admin</option>
               </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 block px-3 py-3 rounded-md text-base font-medium ${
                   location.pathname === link.path
                    ? 'text-emergency-600 bg-emergency-50'
                    : 'text-gray-700 hover:text-emergency-600 hover:bg-gray-50'
                }`}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            ))}
             <div className="px-3 py-3 mt-2 border-t">
               <p className="text-xs text-gray-400 mb-1">Simulate Role:</p>
               <select 
                 value={currentUserRole}
                 onChange={(e) => setRole(e.target.value as any)}
                 className="w-full text-sm border rounded px-2 py-2 bg-gray-100 text-gray-800"
               >
                 <option value="CALLER">Caller</option>
                 <option value="VOLUNTEER">Volunteer</option>
                 <option value="ADMIN">Admin</option>
               </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

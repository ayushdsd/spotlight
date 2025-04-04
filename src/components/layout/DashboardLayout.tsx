import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const artistNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Jobs', path: '/dashboard/jobs', icon: '💼' },
  { name: 'My Applications', path: '/dashboard/applications', icon: '📝' },
  { name: 'Profile', path: '/dashboard/profile', icon: '👤' },
  { name: 'Portfolio', path: '/dashboard/portfolio', icon: '🎨' },
  { name: 'Messages', path: '/dashboard/messages', icon: '💬' },
  { name: 'Subscription', path: '/dashboard/subscription', icon: '⭐' },
];

const recruiterNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Post Job', path: '/dashboard/post-job', icon: '✨' },
  { name: 'My Listings', path: '/dashboard/listings', icon: '📋' },
  { name: 'Applicants', path: '/dashboard/applicants', icon: '👥' },
  { name: 'Company Profile', path: '/dashboard/company', icon: '🏢' },
  { name: 'Messages', path: '/dashboard/messages', icon: '💬' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: '📊' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isRecruiter = user?.role === 'recruiter';
  const navItems = isRecruiter ? recruiterNavItems : artistNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Menu Button - Always visible on mobile */}
      <div className="fixed top-0 left-0 right-0 lg:hidden bg-white border-b border-gray-200 p-4 z-30">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-600 hover:text-blue-600 p-2 text-2xl"
        >
          ☰
        </button>
      </div>

      <div className="flex pt-[60px] lg:pt-0">
        {/* Sidebar */}
        <aside 
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 bg-white border-r border-gray-200 shadow-sm`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <Link to="/" className="block">
                <span className="text-2xl font-minimal font-bold text-gray-900">
                  Spotlight
                </span>
              </Link>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-blue-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="text-xl">{isRecruiter ? '🏢' : '👤'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{isRecruiter ? 'Recruiter' : 'Artist'}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <span className={`text-xl mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all group"
              >
                <span className="text-xl mr-3 group-hover:text-red-600">🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 lg:hidden z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

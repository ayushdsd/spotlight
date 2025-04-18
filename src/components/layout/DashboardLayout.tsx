import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const artistNavItems = [
  { name: 'Feed', path: '/feed', icon: '📰' },
  { name: 'Dashboard', path: '/artist/dashboard', icon: '🏠' },
  { name: 'Jobs', path: '/artist/jobs', icon: '💼' },
  { name: 'My Applications', path: '/artist/applications', icon: '📝' },
  { name: 'Profile', path: '/artist/profile', icon: '👤' },
  { name: 'Portfolio', path: '/artist/portfolio', icon: '🎨' },
  { name: 'Messages', path: '/artist/messages', icon: '💬' },
  { name: 'Subscription', path: '/artist/subscription', icon: '⭐' },
];

const recruiterNavItems = [
  { name: 'Feed', path: '/feed', icon: '📰' },
  { name: 'Dashboard', path: '/recruiter/dashboard', icon: '🏠' },
  { name: 'Post Job', path: '/recruiter/post-job', icon: '✨' },
  { name: 'My Listings', path: '/recruiter/listings', icon: '📋' },
  { name: 'Applicants', path: '/recruiter/applicants', icon: '👥' },
  { name: 'Company Profile', path: '/recruiter/company', icon: '🏢' },
  { name: 'Messages', path: '/recruiter/messages', icon: '💬' },
  { name: 'Analytics', path: '/recruiter/analytics', icon: '📊' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Select nav items based on user role
  const navItems = user?.role === 'artist' ? artistNavItems : recruiterNavItems;

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between h-16 border-b px-4">
            <img src="/spotlight-logo.png" alt="Spotlight" className="h-8" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                      isActiveRoute(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <img
                src={user?.picture || '/default-avatar.png'}
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-sm">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <span className="mr-3">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <span className="text-lg font-semibold text-gray-900">Spotlight</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

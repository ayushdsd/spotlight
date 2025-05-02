import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import spotlightLogo from '../../assets/SPOTLIGHT.png';
import { ArtistSidebarIcons, RecruiterSidebarIcons } from './SidebarIcons';

interface DashboardLayoutProps {
  children: ReactNode;
}

// Update NavItem type to allow icon as JSX.Element
type NavItem = { name: string; path: string; icon: JSX.Element; external?: boolean };

const artistNavItems: NavItem[] = [
  { name: 'Feed', path: '/feed', icon: ArtistSidebarIcons.Feed },
  { name: 'Dashboard', path: '/artist/dashboard', icon: ArtistSidebarIcons.Dashboard },
  { name: 'Jobs', path: '/artist/jobs', icon: ArtistSidebarIcons.Jobs },
  { name: 'My Applications', path: '/artist/applications', icon: ArtistSidebarIcons['My Applications'] },
  { name: 'Profile', path: '/artist/profile', icon: ArtistSidebarIcons.Profile },
  // Portfolio nav item will be handled below
  { name: 'Messages', path: '/artist/messages', icon: ArtistSidebarIcons.Messages },
  { name: 'Subscription', path: '/artist/subscription', icon: ArtistSidebarIcons.Subscription },
];

const recruiterNavItems: NavItem[] = [
  { name: 'Feed', path: '/feed', icon: RecruiterSidebarIcons.Feed },
  { name: 'Dashboard', path: '/recruiter/dashboard', icon: RecruiterSidebarIcons.Dashboard },
  { name: 'Post Job', path: '/recruiter/post-job', icon: RecruiterSidebarIcons['Post Job'] },
  { name: 'My Listings', path: '/recruiter/listings', icon: RecruiterSidebarIcons['My Listings'] },
  { name: 'Applicants', path: '/recruiter/applicants', icon: RecruiterSidebarIcons.Applicants },
  { name: 'Company Profile', path: '/recruiter/company', icon: RecruiterSidebarIcons['Company Profile'] },
  { name: 'Messages', path: '/recruiter/messages', icon: RecruiterSidebarIcons.Messages },
  { name: 'Analytics', path: '/recruiter/analytics', icon: RecruiterSidebarIcons.Analytics },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Select nav items based on user role
  let navItems = user?.role === 'artist' ? artistNavItems : recruiterNavItems;

  // For artists, inject portfolio link if available
  if (user?.role === 'artist' && user?.portfolioLink) {
    navItems = [
      ...artistNavItems.slice(0, 5),
      { name: 'Portfolio', path: user.portfolioLink, icon: ArtistSidebarIcons.Portfolio, external: true },
      ...artistNavItems.slice(5)
    ];
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-cream-50">
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
        } fixed inset-y-0 left-0 z-50 w-64 bg-blue-50 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between h-16 border-b px-4 bg-blue-50">
            <img src={spotlightLogo} alt="Spotlight" className="h-8" />
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
              {navItems.map((item) =>
                item.external ? (
                  <li key={item.name}>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`sidebar-link flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${isActiveRoute(item.path) ? 'bg-[#F2C200] text-black font-semibold' : 'text-gray-700 hover:bg-[#F2C200] hover:text-black'}`}
                    >
                      <span className="mr-4 flex items-center">{item.icon}</span>
                      <span>{item.name}</span>
                    </a>
                  </li>
                ) : (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`sidebar-link flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${isActiveRoute(item.path) ? 'bg-[#F2C200] text-black font-semibold' : 'text-gray-700 hover:bg-[#F2C200] hover:text-black'}`}
                    >
                      <span className="mr-4 flex items-center">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              )}
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
              className="mt-8 mx-4 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg font-medium shadow"
            >
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
        <main className="flex-1 overflow-y-auto p-6 bg-cream-50">
          {children}
        </main>
      </div>
    </div>
  );
}

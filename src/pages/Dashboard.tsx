import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TbClipboardList, TbMessages } from 'react-icons/tb';
import { MdOutlineWorkOutline, MdOutlineDashboard } from 'react-icons/md';

interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon?: JSX.Element;
}

function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <div className="bg-cta2 rounded-xl border border-black p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        {icon && (
          <span>{icon}</span>
        )}
      </div>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  subtitle: string;
  status: 'applied' | 'accepted' | 'rejected' | 'pending';
  date: string;
}

function ActivityItem({ title, subtitle, status, date }: ActivityItemProps) {
  const statusStyles = {
    applied: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-all">
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Applications', value: '24', trend: 12, icon: <TbClipboardList className="text-2xl text-white" strokeWidth={1.5} /> },
    { title: 'Interviews', value: '8', trend: 5, icon: <MdOutlineWorkOutline className="text-2xl text-white" /> },
    { title: 'Profile Views', value: '156', trend: 25, icon: <MdOutlineDashboard className="text-2xl text-white" /> },
    { title: 'Messages', value: '12', icon: <TbMessages className="text-2xl text-white" strokeWidth={1.5} /> },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Lead Guitarist Position',
      subtitle: 'Rock Band LLC',
      status: 'applied' as const,
      date: '2h ago',
    },
    {
      id: 2,
      title: 'Vocalist Position',
      subtitle: 'Jazz Ensemble',
      status: 'accepted' as const,
      date: '1d ago',
    },
    {
      id: 3,
      title: 'Piano Teacher',
      subtitle: 'Music School',
      status: 'rejected' as const,
      date: '2d ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="perspective-1000">
        {/* Welcome Section */}
        <div className="mb-8 transform-style-3d hover:translate-z-2 transition-transform">
          <h1 className="text-3xl font-minimal font-bold text-gray-900 mb-2 animate-fade-in">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-600">Here's what's happening with your applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.title}
              className="transform-style-3d hover:translate-z-4 hover:-translate-y-1 transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 transform-style-3d">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:translate-z-2 transition-transform">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-minimal font-bold text-gray-900">Recent Activity</h2>
                <Link 
                  to="/applications" 
                  className="text-blue-500 hover:text-blue-600 transform-gpu hover:-translate-y-0.5 transition-transform"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="transform-style-3d hover:translate-z-2 hover:-translate-y-0.5 transition-transform"
                  >
                    <ActivityItem {...activity} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="transform-style-3d">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:translate-z-2 transition-transform">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-6">Recommended Jobs</h2>
              <div className="space-y-4">
                {/* Job Cards */}
                <div className="p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-all hover:bg-blue-50">
                  <h3 className="font-medium text-gray-900">Senior Theater Director</h3>
                  <p className="text-sm text-gray-500 mt-1">Royal Shakespeare Company</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">London, UK</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">Full-time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

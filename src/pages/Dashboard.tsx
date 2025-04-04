import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: string;
}

function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-500/30 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl text-blue-500">{icon}</span>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-minimal font-bold text-gray-900">{value}</p>
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
  const statusColors = {
    applied: 'bg-blue-50 text-blue-600',
    accepted: 'bg-green-50 text-green-600',
    rejected: 'bg-red-50 text-red-600',
    pending: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100">
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-minimal font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-600">Here's what's happening with your applications</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Applications"
              value="24"
              trend={12}
              icon="📝"
            />
            <StatCard
              title="Interviews"
              value="8"
              trend={5}
              icon="🎯"
            />
            <StatCard
              title="Profile Views"
              value="156"
              trend={25}
              icon="👁️"
            />
            <StatCard
              title="Messages"
              value="12"
              icon="💬"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-minimal font-bold text-gray-900">Recent Activity</h2>
                <Link 
                  to="/applications"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                <ActivityItem
                  title="Lead Guitarist Position"
                  subtitle="Rock Band LLC"
                  status="applied"
                  date="2h ago"
                />
                <ActivityItem
                  title="Vocalist Position"
                  subtitle="Jazz Ensemble"
                  status="accepted"
                  date="1d ago"
                />
                <ActivityItem
                  title="Piano Teacher"
                  subtitle="Music School"
                  status="rejected"
                  date="2d ago"
                />
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Recommended Jobs</h2>
              <div className="space-y-4">
                {/* Job Cards */}
                <div className="p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-all hover:bg-blue-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                      <span className="text-lg">🎸</span>
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium">Bass Guitarist</h3>
                      <p className="text-gray-600 text-sm">Rock Band LLC • Full-time</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">95% Match</span>
                    <span className="text-xs text-gray-500">Posted 2h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

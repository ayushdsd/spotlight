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

interface JobListingProps {
  title: string;
  applicants: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
}

function JobListing({ title, applicants, status, postedDate }: JobListingProps) {
  const statusColors = {
    active: 'bg-green-50 text-green-600',
    closed: 'bg-red-50 text-red-600',
    draft: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100">
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-600">{applicants} applicants</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="text-xs text-gray-500">{postedDate}</span>
      </div>
    </div>
  );
}

interface ApplicantCardProps {
  name: string;
  role: string;
  experience: string;
}

function ApplicantCard({ name, role, experience }: ApplicantCardProps) {
  return (
    <div
      className="p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-all bg-white shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
          <span className="text-lg">👤</span>
        </div>
        <div>
          <h3 className="text-gray-900 font-medium">{name}</h3>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Top Match</span>
        <span className="text-xs text-gray-500">{experience} exp.</span>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'Active Listings', value: 8, trend: 5, icon: '📋' },
    { title: 'Total Applicants', value: 156, trend: 15, icon: '👥' },
    { title: 'Interviews Scheduled', value: 12, icon: '📅' },
    { title: 'Messages', value: 24, trend: 8, icon: '💬' },
  ];

  const recentListings = [
    {
      title: 'Senior Theater Director',
      applicants: 45,
      status: 'active' as const,
      postedDate: '2 days ago',
    },
    {
      title: 'Voice Actor for Animation Series',
      applicants: 78,
      status: 'active' as const,
      postedDate: '3 days ago',
    },
    {
      title: 'Background Dancer',
      applicants: 23,
      status: 'closed' as const,
      postedDate: '1 week ago',
    },
    {
      title: 'Assistant Choreographer',
      applicants: 0,
      status: 'draft' as const,
      postedDate: 'Not posted',
    },
  ];

  const topApplicants = [
    {
      name: 'Sarah Johnson',
      role: 'Theater Director',
      experience: '8 years',
    },
    {
      name: 'Michael Chen',
      role: 'Voice Actor',
      experience: '5 years',
    },
    {
      name: 'Emma Davis',
      role: 'Dancer',
      experience: '6 years',
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-minimal font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-600">Here's what's happening with your job listings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Listings */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-minimal font-bold text-gray-900">Active Listings</h2>
                <Link 
                  to="/dashboard/post-job"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                >
                  Post New Job
                </Link>
              </div>
              <div className="space-y-2">
                {recentListings.map((listing) => (
                  <JobListing key={listing.title} {...listing} />
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Recent Applications</h2>
              <div className="space-y-4">
                {topApplicants.map((applicant) => (
                  <ApplicantCard key={applicant.name} {...applicant} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/dashboard/applicants"
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-all hover:bg-blue-50"
                >
                  <span className="text-2xl">👥</span>
                  <div>
                    <h3 className="font-medium text-gray-900">View Applicants</h3>
                    <p className="text-sm text-gray-600">Review applications</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/listings"
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-all hover:bg-blue-50"
                >
                  <span className="text-2xl">📋</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Listings</h3>
                    <p className="text-sm text-gray-600">Update your job posts</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: string;
}

function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <div className="bg-cream-100 p-6 rounded-xl border border-blue-50 hover:border-blue-100 transition-all shadow-sm">
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

interface Job {
  _id: string;
  title: string;
  applicants?: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

// Helper to count applicants for a job (if not present)
function countApplicants(job: any): number {
  // If job.applicants is a number, just use it
  if (typeof job.applicants === 'number') return job.applicants;
  // If job.applications is an array, use its length
  if (Array.isArray(job.applications)) return job.applications.length;
  // If job has applicants array
  if (Array.isArray(job.applicants)) return job.applicants.length;
  return 0;
}

function JobListing({ title, applicants, status, createdAt, ...job }: Job) {
  const statusColors = {
    active: 'bg-green-50 text-green-600',
    closed: 'bg-red-50 text-red-600',
    draft: 'bg-yellow-50 text-yellow-600',
  };
  const applicantCount = typeof applicants === 'number' ? applicants : countApplicants(job);
  return (
    <div className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100">
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-600">{applicantCount} applicant{applicantCount === 1 ? '' : 's'}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        <span className="text-xs text-gray-500">{new Date(createdAt).toLocaleDateString()}</span>
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
    <div className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100 min-w-0">
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-sm font-medium text-gray-900 truncate" title={name}>{name}</h3>
        <p className="text-sm text-gray-600 truncate" title={role}>{role}</p>
      </div>
      <div className="flex flex-col items-end gap-1 min-w-fit">
        <span className="text-xs text-gray-500">Experience: {experience}</span>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'Active Listings', value: 8, trend: 5, icon: '📋' },
    { title: 'Total Applicants', value: 156, trend: 15, icon: '👥' },
    { title: 'Messages', value: 24, trend: 8, icon: '💬' },
    { title: 'Profile Views', value: 52, trend: 10, icon: '👀' },
  ];

  const [recentListings, setRecentListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/jobs/recruiter/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort by createdAt (descending) and take the latest 3
        const jobs: Job[] = response.data.jobs
          .sort((a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setRecentListings(jobs);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchRecentApplications = async () => {
      setLoadingApplications(true);
      setApplicationsError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/jobs/applications/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort by most recent and pick the latest 3
        const sorted = response.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentApplications(sorted.slice(0, 3));
      } catch (error: any) {
        setApplicationsError(error.response?.data?.error || 'Error fetching applications');
      } finally {
        setLoadingApplications(false);
      }
    };
    fetchRecentApplications();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-cream-50">
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
            <div className="bg-cream-100 rounded-xl border border-blue-50 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-minimal font-bold text-gray-900">Active Listings</h2>
                <Link 
                  to="/dashboard/post-job"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                >
                  Post New Job
                </Link>
              </div>
              {error && (
                <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
              )}
              <div className="space-y-2">
                {loading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : recentListings.length === 0 ? (
                  <div className="text-gray-500">No job postings yet.</div>
                ) : (
                  recentListings.map((listing) => (
                    <JobListing key={listing._id} {...listing} />
                  ))
                )}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-cream-100 rounded-xl border border-blue-50 p-6 shadow-sm">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Recent Applications</h2>
              {loadingApplications ? (
                <div className="text-gray-500">Loading applications...</div>
              ) : applicationsError ? (
                <div className="text-red-500">{applicationsError}</div>
              ) : recentApplications.length === 0 ? (
                <div className="text-gray-500">No recent applications found.</div>
              ) : (
                <div className="space-y-2">
                  {recentApplications.map((app, idx) => (
                    <ApplicantCard
                      key={app._id || idx}
                      name={app.applicant?.name || 'Unknown'}
                      role={app.job?.title || 'Unknown Role'}
                      experience={"N/A"}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-cream-100 rounded-xl border border-blue-50 p-6 shadow-sm">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/dashboard/applicants"
                  className="flex items-center gap-3 p-4 rounded-lg border border-blue-50 hover:border-blue-100 transition-all hover:bg-blue-50"
                >
                  <span className="text-2xl">👥</span>
                  <div>
                    <h3 className="font-medium text-gray-900">View Applicants</h3>
                    <p className="text-sm text-gray-600">Review applications</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/listings"
                  className="flex items-center gap-3 p-4 rounded-lg border border-blue-50 hover:border-blue-100 transition-all hover:bg-blue-50"
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

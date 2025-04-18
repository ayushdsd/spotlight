import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../utils/api';

interface Application {
  id: number;
  jobId: number;
  job: {
    title: string;
    company: string;
    location: string;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  coverLetter: string;
  availability: string;
  expectedSalary: string;
  portfolioLinks: string[];
}

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const userToken = user?.token;
      const response = await axios.get(`${API_BASE_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setApplications(response.data);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.error || 'Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
          <p className="mt-1 text-sm text-gray-500">Track the status of your job applications</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900">No applications yet</h3>
            <p className="mt-2 text-gray-600">Start applying to jobs to see your applications here</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {application.job.title}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{application.job.company}</span>
                        <span className="mx-2">•</span>
                        <span>{application.job.location}</span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Applied {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {/* View application details */}}
                      className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;

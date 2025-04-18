import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  startDate: string;
  companyInfo: {
    name: string;
    description: string;
    website: string;
    location: string;
  };
  applications: {
    count: number;
    new: number;
  };
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

const RecruiterListings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only recruiters can access this page
  if (!user || user.role !== 'recruiter') {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/recruiter/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data.jobs);
      } catch (error: any) {
        console.error('Error fetching jobs:', error);
        setError(error.response?.data?.error || 'Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const closeJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/jobs/${jobId}/status`,
        { status: 'closed' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status: 'closed' } : job
      ));
    } catch (error: any) {
      console.error('Error closing job:', error);
      setError(error.response?.data?.error || 'Error closing job');
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (error: any) {
      console.error('Error deleting job:', error);
      setError(error.response?.data?.error || 'Error deleting job');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Job Listings</h1>
            <p className="mt-2 text-gray-600">Manage your posted jobs and view applications</p>
          </div>
          <Link
            to="/recruiter/jobs/new"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post New Job
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">Start by posting your first job opening</p>
            <Link
              to="/recruiter/jobs/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          to={`/gigs/${job._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600"
                        >
                          {job.title}
                        </Link>
                        <span className="text-sm text-gray-500">{job.location}</span>
                        <span className="text-sm text-gray-500">{job.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applications`}
                        className="group flex flex-col hover:text-blue-600"
                      >
                        <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                          {job.applications.count}
                        </span>
                        {job.applications.new > 0 && (
                          <span className="text-sm text-green-600">
                            {job.applications.new} new
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full
                        ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                          job.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/recruiter/jobs/${job._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      {job.status === 'active' && (
                        <button
                          onClick={() => closeJob(job._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterListings;

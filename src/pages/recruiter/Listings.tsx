import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../utils/api';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

const RecruiterListings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  if (!user || user.role !== 'recruiter') {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/jobs/recruiter/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data.jobs);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
      if (selectedJob?._id === jobId) setSelectedJob(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error deleting job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (job: Job) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const newStatus = job.status === 'active' ? 'inactive' : 'active';
      await axios.put(`${API_BASE_URL}/api/jobs/${job._id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
      if (selectedJob?._id === job._id) setSelectedJob({ ...job, status: newStatus });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error updating status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Job Listings</h1>
            <p className="mt-2 text-gray-600 text-base sm:text-lg">Manage your posted jobs</p>
          </div>
          <Link to="/post-job" className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-center">Post New Job</Link>
        </div>
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
        )}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">Start by posting your first job opening</p>
            <Link to="/post-job" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Post a Job</Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className={`hover:bg-blue-50 cursor-pointer ${selectedJob?._id === job._id ? 'bg-blue-50' : ''}`} onClick={() => handleSelectJob(job)}>
                    <td className="px-2 sm:px-6 py-4 font-medium text-gray-900 max-w-[120px] sm:max-w-none truncate">{job.title}</td>
                    <td className="px-2 sm:px-6 py-4 max-w-[100px] sm:max-w-none truncate">{job.location}</td>
                    <td className="px-2 sm:px-6 py-4">{job.type}</td>
                    <td className="px-2 sm:px-6 py-4">{job.status}</td>
                    <td className="px-2 sm:px-6 py-4">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="px-2 sm:px-6 py-4 text-right">
                      <button onClick={e => { e.stopPropagation(); handleToggleStatus(job); }} disabled={actionLoading} className={`mr-2 px-2 sm:px-3 py-1 rounded ${job.status === 'active' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} text-xs`}>
                        {job.status === 'active' ? 'Make Inactive' : 'Make Active'}
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(job._id); }} disabled={actionLoading} className="px-2 sm:px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedJob && (
              <div className="mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-100 shadow">
                <h2 className="text-lg sm:text-xl font-bold mb-2">{selectedJob.title}</h2>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Company:</span> {selectedJob.company}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Location:</span> {selectedJob.location}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Type:</span> {selectedJob.type}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Category:</span> {selectedJob.category}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Status:</span> {selectedJob.status}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Posted:</span> {new Date(selectedJob.createdAt).toLocaleString()}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Description:</span></div>
                <div className="whitespace-pre-line text-gray-900 bg-white p-3 sm:p-4 rounded shadow-inner border border-blue-50 text-sm sm:text-base">{selectedJob.description}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterListings;

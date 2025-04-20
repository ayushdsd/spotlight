import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../utils/api';

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    description: string;
    requirements: string;
    benefits?: string;
    deadline?: string;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: string;
  coverLetter?: string;
  availability?: string;
  expectedSalary?: string;
  portfolioLinks?: string[];
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
      console.log('User token:', userToken);
      const response = await axios.get(`${API_BASE_URL}/api/jobs/applications/me`, {
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
          <ul>
            {applications.map((app) => (
              <li key={app._id} className="mb-8 p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900">{app.job.title}</h3>
                <div className="text-gray-700 mb-1">{app.job.company} &bull; {app.job.location} &bull; {app.job.type}</div>
                <div className="text-gray-500 mb-2">Category: {app.job.category}</div>
                <div className="mb-2"><span className="font-medium">Salary:</span> {app.job.salary.min} - {app.job.salary.max} {app.job.salary.currency}</div>
                <div className="mb-2"><span className="font-medium">Status:</span> <span className={getStatusColor(app.status)}>{app.status}</span></div>
                <div className="mb-2"><span className="font-medium">Applied On:</span> {new Date(app.appliedAt).toLocaleDateString()}</div>
                <div className="mb-2"><span className="font-medium">Description:</span> {app.job.description}</div>
                {app.job.benefits && <div className="mb-2"><span className="font-medium">Benefits:</span> <ul className="list-disc list-inside">{app.job.benefits.split('\n').map((b, i) => <li key={i}>{b}</li>)}</ul></div>}
                <div className="mb-2"><span className="font-medium">Requirements:</span> <ul className="list-disc list-inside">{app.job.requirements.split('\n').map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                {app.coverLetter && <div className="mb-2"><span className="font-medium">Your Cover Letter:</span> {app.coverLetter}</div>}
                {app.availability && <div className="mb-2"><span className="font-medium">Availability:</span> {app.availability}</div>}
                {app.expectedSalary && <div className="mb-2"><span className="font-medium">Expected Salary:</span> {app.expectedSalary}</div>}
                {app.portfolioLinks && <div className="mb-2"><span className="font-medium">Portfolio Links:</span> <ul className="list-disc list-inside">{app.portfolioLinks.map((link, i) => <li key={i}>{link}</li>)}</ul></div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;

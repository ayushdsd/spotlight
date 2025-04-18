import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../utils/api';

interface Application {
  _id: string;
  jobId: string;
  applicant: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
    portfolioLinks: {
      title: string;
      url: string;
      description: string;
    }[];
  };
  coverLetter: string;
  availability: string;
  expectedSalary: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

const ApplicationStatus = {
  pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
  reviewed: { label: 'Reviewed', class: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Accepted', class: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800' },
};

const JobApplications = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Only recruiters can access this page
  if (!user || user.role !== 'recruiter') {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const [jobResponse, applicationsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/jobs/${jobId}/applications`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setJob(jobResponse.data);
        setApplications(applicationsResponse.data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.error || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/applications/${applicationId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error: any) {
      console.error('Error updating application:', error);
      setError(error.response?.data?.error || 'Error updating application');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {job && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="mt-2 flex items-center text-gray-500">
              <span>{job.company}</span>
              <span className="mx-2">•</span>
              <span>{job.location}</span>
              <span className="mx-2">•</span>
              <span>{job.type}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Applications List */}
            <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Applications ({applications.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {applications.map((application) => (
                  <button
                    key={application._id}
                    onClick={() => setSelectedApplication(application)}
                    className={`w-full px-4 py-4 text-left hover:bg-gray-50 focus:outline-none ${
                      selectedApplication?._id === application._id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {application.applicant.name}
                        </h3>
                        <p className="text-sm text-gray-500">{application.applicant.email}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        ApplicationStatus[application.status].class
                      }`}>
                        {ApplicationStatus[application.status].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Applied {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Application Details */}
            {selectedApplication ? (
              <div className="flex-1 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Application Details</h2>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedApplication.status}
                        onChange={(e) => updateApplicationStatus(
                          selectedApplication._id,
                          e.target.value as Application['status']
                        )}
                        className="rounded-md border border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {Object.entries(ApplicationStatus).map(([value, { label }]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Applicant Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Applicant Information</h3>
                    <div className="flex items-start gap-4">
                      {selectedApplication.applicant.picture ? (
                        <img
                          src={selectedApplication.applicant.picture}
                          alt={selectedApplication.applicant.name}
                          className="h-16 w-16 rounded-full"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xl font-medium text-gray-500">
                            {selectedApplication.applicant.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {selectedApplication.applicant.name}
                        </h4>
                        <p className="text-gray-600">{selectedApplication.applicant.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Cover Letter</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>

                  {/* Availability & Salary */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
                      <p className="text-gray-600">{selectedApplication.availability}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Expected Salary</h3>
                      <p className="text-gray-600">{selectedApplication.expectedSalary}</p>
                    </div>
                  </div>

                  {/* Portfolio Links */}
                  {selectedApplication.applicant.portfolioLinks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio</h3>
                      <div className="space-y-3">
                        {selectedApplication.applicant.portfolioLinks.map((link, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900">{link.title}</h4>
                            {link.description && (
                              <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                            )}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-500 mt-2 inline-block"
                            >
                              View Project
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-lg shadow flex items-center justify-center text-gray-500">
                Select an application to view details
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobApplications;

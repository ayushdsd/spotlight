import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import JobApplicationForm from '../components/job/JobApplicationForm';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  payRange: string;
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
}

const GigDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJob(response.data);
    } catch (error: any) {
      console.error('Error fetching job:', error);
      setError(error.response?.data?.error || 'Error loading job details');
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only artists can apply for jobs
  const canApply = user.role === 'artist';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
            {error || 'Job not found'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {applicationSubmitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium">Application Submitted!</h3>
              <p className="mt-1">Thank you for applying. The recruiter will review your application and contact you soon.</p>
            </div>
          ) : showApplicationForm ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for {job.title}</h2>
                <JobApplicationForm
                  jobId={id || ''}
                  onSubmit={() => {
                    setShowApplicationForm(false);
                    setApplicationSubmitted(true);
                  }}
                  onCancel={() => setShowApplicationForm(false)}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-8 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <div className="mt-2 flex items-center text-gray-500">
                      <span>{job.company}</span>
                      <span className="mx-2">•</span>
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  {canApply && !applicationSubmitted && (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                    <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {job.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <section className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pay Range</dt>
                        <dd className="mt-1 text-sm text-gray-900">{job.payRange}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{job.startDate}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                        <dd className="mt-1 text-sm text-gray-900">{job.applicationDeadline}</dd>
                      </div>
                    </dl>
                  </section>

                  <section className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About {job.companyInfo.name}</h2>
                    <p className="text-sm text-gray-600 mb-4">{job.companyInfo.description}</p>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Website</dt>
                        <dd className="mt-1">
                          <a
                            href={job.companyInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-500"
                          >
                            {job.companyInfo.website}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900">{job.companyInfo.location}</dd>
                      </div>
                    </dl>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GigDetail;

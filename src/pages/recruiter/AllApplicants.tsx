import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../utils/api';
import { Link } from 'react-router-dom';

interface Applicant {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  jobsApplied: {
    _id: string;
    title: string;
    company: string;
  }[];
}

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
  };
  applicant: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  status: string;
  createdAt: string;
}

const AllApplicants = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllApplications();
    // eslint-disable-next-line
  }, []);

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/jobs/applications/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error loading applicants');
    } finally {
      setLoading(false);
    }
  };

  // Group applications by applicant
  const applicantsMap: { [applicantId: string]: Applicant } = {};
  applications.forEach(app => {
    if (!applicantsMap[app.applicant._id]) {
      applicantsMap[app.applicant._id] = {
        _id: app.applicant._id,
        name: app.applicant.name,
        email: app.applicant.email,
        picture: app.applicant.picture,
        jobsApplied: [],
      };
    }
    applicantsMap[app.applicant._id].jobsApplied.push({
      _id: app.job._id,
      title: app.job.title,
      company: app.job.company,
    });
  });
  const applicants = Object.values(applicantsMap);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">All Applicants</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : applicants.length === 0 ? (
          <div>No applicants found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applicants.map(applicant => (
              <div key={applicant._id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  {applicant.picture ? (
                    <img src={applicant.picture} alt={applicant.name} className="h-12 w-12 rounded-full" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-500">{applicant.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{applicant.name}</div>
                    <div className="text-gray-600 text-sm">{applicant.email}</div>
                    <Link
                      to={`/artists/${applicant._id}`}
                      target="_blank"
                      className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-700 font-medium mb-1">Jobs Applied:</div>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {applicant.jobsApplied.map(job => (
                      <li key={job._id}>
                        <Link to={`/gigs/${job._id}`} className="text-blue-600 hover:underline">
                          {job.title}
                        </Link>{' '}
                        <span className="text-gray-500">({job.company})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllApplicants;

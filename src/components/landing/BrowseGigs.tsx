import { useState, useEffect } from 'react';
import axios from 'axios';
import JobList, { Job } from '../job/JobList';

const BrowseGigs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/jobs');
      // Only show first 6 jobs on landing page
      setJobs(response.data.slice(0, 6));
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.error || 'Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-minimal text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Latest Opportunities
          </h2>
          <p className="text-gray-600 text-lg">
            Discover exciting roles in the performing arts industry
          </p>
        </div>
        <JobList jobs={jobs} loading={loading} error={error} />
      </div>
    </section>
  );
};

export default BrowseGigs;

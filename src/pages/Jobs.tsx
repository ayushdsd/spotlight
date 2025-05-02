import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import JobList, { Job } from '../components/job/JobList';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

const categories = [
  { id: 'all', name: 'All Jobs' },
  { id: 'acting', name: 'Acting' },
  { id: 'music', name: 'Music' },
  { id: 'dance', name: 'Dance' },
  { id: 'theater', name: 'Theater' },
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
      const response = await axios.get(`${API_BASE_URL}/api/jobs`);
      setJobs(response.data);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.error || 'Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs
    .filter(job => job.status === 'active')
    .filter(job => 
      (selectedCategory === 'all' || job.category === selectedCategory) &&
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <DashboardLayout>
      <div className="perspective-1000">
        {/* Header Section */}
        <div className="mb-8 transform-style-3d hover:translate-z-2 transition-transform">
          <h1 className="text-3xl font-minimal font-bold text-gray-900 mb-2 animate-fade-in">Jobs</h1>
          <p className="text-gray-600">Find your next opportunity in the performing arts</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="transform-style-3d hover:translate-z-2 transition-transform">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap border-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 transform-style-3d hover:translate-z-1 transition-transform ${
                  selectedCategory === category.id
                    ? 'bg-[#F2C200] text-black font-semibold'
                    : 'bg-[#551138] text-white hover:bg-[#F2C200] hover:text-black'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Job List */}
        <JobList jobs={filteredJobs} loading={loading} error={error} />
      </div>
    </DashboardLayout>
  );
};

export default Jobs;

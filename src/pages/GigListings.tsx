import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import SearchBar from '../components/search/SearchBar';
import FilterPanel, { SearchFilters } from '../components/search/FilterPanel';
import { useAuth } from '../contexts/AuthContext';

interface Job {
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
  skills: string[];
  deadline: string;
  postedBy: {
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
}

const GigListings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pages: 1,
  });

  const searchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchQuery && { query: searchQuery }),
        ...(filters.location && { location: filters.location }),
        ...(filters.type && { type: filters.type }),
        ...(filters.category && { category: filters.category }),
        ...(filters.skills?.length && { skills: filters.skills.join(',') }),
        ...(filters.minSalary && { minSalary: filters.minSalary.toString() }),
        ...(filters.maxSalary && { maxSalary: filters.maxSalary.toString() }),
      });

      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/search/jobs?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Error searching jobs:', error);
      setError(error.response?.data?.error || 'Error searching jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchJobs();
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    searchJobs(newPage);
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Opportunities</h1>
          {user?.role === 'recruiter' && (
            <Link
              to="/post-job"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Post a Job
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              showJobFilters={true}
            />
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search jobs by title, company, or skills..."
              className="mb-6"
            />

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {job.title}
                            </h3>
                            <div className="flex items-center mb-4">
                              <img
                                src={job.postedBy.profilePicture || '/default-company.png'}
                                alt={job.company}
                                className="w-8 h-8 rounded-full mr-3"
                              />
                              <div>
                                <p className="text-gray-700 font-medium">
                                  {job.company}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  {job.location}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-full">
                              {job.type}
                            </span>
                            <p className="text-gray-500 text-sm mt-2">
                              Posted {formatDate(job.createdAt)}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-semibold text-gray-700">
                            {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex space-x-2">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-md ${
                              pagination.page === page
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GigListings;

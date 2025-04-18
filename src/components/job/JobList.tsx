import { Link } from 'react-router-dom';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  posted: string;
}

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  error?: string | null;
}

const JobList = ({ jobs, loading = false, error = null }: JobListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
        <p className="mt-2 text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Link
          key={job.id}
          to={`/gigs/${job.id}`}
          className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform-style-3d hover:translate-z-2 transition-transform"
        >
          <h3 className="font-minimal text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-gray-600 mt-1">{job.company}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {job.type}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {job.location}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {job.salary}
            </span>
          </div>
          <div className="mt-4 text-sm text-gray-500">Posted {job.posted}</div>
        </Link>
      ))}
    </div>
  );
};

export default JobList;

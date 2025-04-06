import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  posted: string;
}

const categories = [
  { id: 'all', name: 'All Jobs' },
  { id: 'acting', name: 'Acting' },
  { id: 'music', name: 'Music' },
  { id: 'dance', name: 'Dance' },
  { id: 'theater', name: 'Theater' },
];

const jobs: Job[] = [
  {
    id: 1,
    title: 'Lead Actor',
    company: 'Royal Theater Company',
    location: 'London, UK',
    type: 'Full-time',
    category: 'acting',
    salary: '$50k - $70k',
    posted: '2d ago',
  },
  {
    id: 2,
    title: 'Dance Instructor',
    company: 'Elite Dance Academy',
    location: 'New York, USA',
    type: 'Part-time',
    category: 'dance',
    salary: '$30-50/hr',
    posted: '3d ago',
  },
  // Add more job listings as needed
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredJobs = jobs.filter(job => 
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
                className={`px-4 py-2 rounded-lg whitespace-nowrap transform-style-3d hover:translate-z-1 transition-transform ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="block"
            >
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm transform-style-3d hover:translate-z-4 hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.type}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.posted}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.salary}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;

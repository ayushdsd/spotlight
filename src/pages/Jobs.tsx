import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  deadline: string;
  matchScore: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Lead Actor for Theater Production',
    company: 'New York Theater Company',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$2,000-$3,000',
    description: 'We are seeking a talented lead actor for our upcoming theater production...',
    requirements: [
      'Minimum 3 years of theater experience',
      'Strong stage presence',
      'Excellent vocal abilities',
      'Available for evening rehearsals'
    ],
    posted: '2 days ago',
    deadline: '2024-04-15',
    matchScore: 95
  },
  // Add more mock jobs...
];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-900">Find Your Next Role</h1>
          <p className="mt-2 text-dark-500">Discover opportunities that match your skills and interests.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Locations</option>
              <option value="New York, NY">New York</option>
              <option value="Los Angeles, CA">Los Angeles</option>
              <option value="Chicago, IL">Chicago</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-dark-900">{job.title}</h2>
                  <p className="text-dark-500 mt-1">{job.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-dark-600">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.salary}</span>
                  </div>
                </div>
                <span className="bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                  {job.matchScore}% Match
                </span>
              </div>

              <div className="mt-4">
                <p className="text-dark-600 line-clamp-2">{job.description}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.requirements.slice(0, 3).map((req, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-100 text-dark-700"
                  >
                    {req}
                  </span>
                ))}
                {job.requirements.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-100 text-dark-700">
                    +{job.requirements.length - 3} more
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-dark-100 pt-4">
                <div className="text-sm text-dark-500">
                  <span>Posted {job.posted}</span>
                  <span className="mx-2">•</span>
                  <span>Apply by {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

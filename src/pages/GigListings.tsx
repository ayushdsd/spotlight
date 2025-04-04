import { useState } from 'react';
import { Link } from 'react-router-dom';

interface GigFilters {
  location: string;
  roleType: string;
  payRange: string;
}

const GigListings = () => {
  const [filters, setFilters] = useState<GigFilters>({
    location: '',
    roleType: '',
    payRange: '',
  });

  // TODO: Replace with actual data from backend
  const gigs = [
    {
      id: 1,
      title: 'Lead Actor for Theater Production',
      company: 'Broadway Theater Company',
      location: 'New York, NY',
      type: 'Full-time',
      payRange: '$2000-$3000 per week',
      description: 'Seeking experienced actor for lead role in upcoming production...',
      postedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Musicians for Live Band',
      company: 'City Music Hall',
      location: 'Los Angeles, CA',
      type: 'Contract',
      payRange: '$500 per performance',
      description: 'Looking for talented musicians for our house band...',
      postedDate: '1 week ago',
    },
    // Add more sample gigs here
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search gigs..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Location</option>
                <option value="ny">New York</option>
                <option value="la">Los Angeles</option>
                <option value="ch">Chicago</option>
              </select>
              <select
                value={filters.roleType}
                onChange={(e) => setFilters({ ...filters, roleType: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Role Type</option>
                <option value="actor">Actor</option>
                <option value="musician">Musician</option>
                <option value="dancer">Dancer</option>
              </select>
              <select
                value={filters.payRange}
                onChange={(e) => setFilters({ ...filters, payRange: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Pay Range</option>
                <option value="0-1000">$0-$1000</option>
                <option value="1000-2000">$1000-$2000</option>
                <option value="2000+">$2000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gig Listings */}
        <div className="space-y-6">
          {gigs.map((gig) => (
            <div key={gig.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/gigs/${gig.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {gig.title}
                    </Link>
                    <p className="text-gray-600">{gig.company}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-gray-500 text-sm">{gig.location}</span>
                      <span className="text-gray-500 text-sm">{gig.type}</span>
                      <span className="text-gray-500 text-sm">{gig.payRange}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{gig.postedDate}</span>
                </div>
                <p className="mt-4 text-gray-600">{gig.description}</p>
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/gigs/${gig.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GigListings;

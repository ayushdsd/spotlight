import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import SearchBar from '../components/search/SearchBar';
import FilterPanel, { SearchFilters } from '../components/search/FilterPanel';

interface Artist {
  _id: string;
  name: string;
  profilePicture?: string;
  location?: string;
  bio?: string;
  skills: string[];
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
}

const ArtistDiscovery = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pages: 1,
  });

  const searchArtists = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchQuery && { query: searchQuery }),
        ...(filters.location && { location: filters.location }),
        ...(filters.skills?.length && { skills: filters.skills.join(',') }),
      });

      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/search/artists?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setArtists(response.data.artists);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Error searching artists:', error);
      setError(error.response?.data?.error || 'Error searching artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchArtists();
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    searchArtists(newPage);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Artists</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              showJobFilters={false}
            />
          </div>

          {/* Artists Grid */}
          <div className="lg:col-span-3">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search artists by name, skills, or location..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artists.map((artist) => (
                    <Link
                      key={artist._id}
                      to={`/artists/${artist._id}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-4">
                          <img
                            src={artist.profilePicture || '/default-avatar.png'}
                            alt={artist.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {artist.name}
                            </h3>
                            {artist.location && (
                              <p className="text-sm text-gray-500">
                                {artist.location}
                              </p>
                            )}
                          </div>
                        </div>
                        {artist.bio && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {artist.bio}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {artist.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {artist.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{artist.skills.length - 3} more
                            </span>
                          )}
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

export default ArtistDiscovery;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

interface ArtistData {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: any[];
  portfolioLinks?: string[];
  portfolioImages?: string[];
  profilePicture?: string;
}

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'experience'>('portfolio');

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArtistData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error loading artist profile');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArtistData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!artistData) {
    return <div className="text-center py-8">Artist not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              {artistData.profilePicture ? (
                <img src={artistData.profilePicture} alt={artistData.name} className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-300"></div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{artistData.name || `${artistData.firstName || ''} ${artistData.lastName || ''}`}</h1>
                {artistData.title && <p className="text-gray-600">{artistData.title}</p>}
                {artistData.location && <p className="text-gray-500 text-sm">{artistData.location}</p>}
              </div>
            </div>
            {artistData.bio && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 text-gray-600">{artistData.bio}</p>
              </div>
            )}
            {artistData.skills && artistData.skills.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Skills</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {artistData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-4 border-b">
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'portfolio' ? 'border-b-2 border-primary-600 text-primary-800' : 'text-gray-500'}`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'experience' ? 'border-b-2 border-primary-600 text-primary-800' : 'text-gray-500'}`}
              onClick={() => setActiveTab('experience')}
            >
              Experience
            </button>
          </div>
          <div className="mt-4">
            {activeTab === 'portfolio' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artistData.portfolioImages && artistData.portfolioImages.length > 0 ? (
                  artistData.portfolioImages.map((img, idx) => (
                    <img key={idx} src={img} alt="Portfolio" className="w-full rounded-lg shadow" />
                  ))
                ) : (
                  <div className="text-gray-500">No portfolio images found.</div>
                )}
                {artistData.portfolioLinks && artistData.portfolioLinks.length > 0 && (
                  <div className="col-span-full mt-4">
                    <h3 className="font-semibold mb-2">Portfolio Links</h3>
                    <ul className="list-disc list-inside">
                      {artistData.portfolioLinks.map((link, idx) => (
                        <li key={idx}><a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {artistData.experience && artistData.experience.length > 0 ? (
                  <ul className="space-y-4">
                    {artistData.experience.map((exp, idx) => (
                      <li key={idx} className="bg-white rounded-lg shadow p-4">
                        <div className="font-semibold text-primary-700">{exp.role || exp.title}</div>
                        <div className="text-gray-700">{exp.company || exp.production}</div>
                        <div className="text-gray-500 text-sm">{exp.period || exp.duration}</div>
                        {exp.description && <div className="mt-2 text-gray-600">{exp.description}</div>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">No experience found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;

import { useState } from 'react';
import { useParams } from 'react-router-dom';

const ArtistProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'experience'>('portfolio');

  // TODO: Fetch actual artist data from backend
  const artist = {
    name: 'Sarah Johnson',
    title: 'Professional Theater Actor',
    location: 'New York, NY',
    bio: 'Experienced theater actor with 5+ years of stage performance. Specialized in dramatic and musical theater.',
    skills: ['Stage Acting', 'Musical Theater', 'Voice Acting', 'Dance'],
    experience: [
      {
        role: 'Lead Actor',
        production: 'Romeo and Juliet',
        company: 'Broadway Theater',
        period: 'Jan 2023 - Mar 2023',
      },
      {
        role: 'Supporting Actor',
        production: 'The Phantom of the Opera',
        company: 'City Theater Company',
        period: 'Jun 2022 - Dec 2022',
      },
    ],
    portfolio: [
      {
        title: 'Performance Highlight',
        description: 'Scene from Romeo and Juliet',
        imageUrl: 'https://placehold.co/600x400',
      },
      {
        title: 'Musical Performance',
        description: 'Solo from The Phantom of the Opera',
        imageUrl: 'https://placehold.co/600x400',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{artist.name}</h1>
                <p className="text-gray-600">{artist.title}</p>
                <p className="text-gray-500 text-sm">{artist.location}</p>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-2 text-gray-600">{artist.bio}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {artist.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`${
                  activeTab === 'portfolio'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`${
                  activeTab === 'experience'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Experience
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'portfolio' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artist.portfolio.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {artist.experience.map((exp, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold">{exp.role}</h3>
                    <p className="text-gray-600">{exp.production}</p>
                    <p className="text-gray-500 text-sm">{exp.company}</p>
                    <p className="text-gray-500 text-sm">{exp.period}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;

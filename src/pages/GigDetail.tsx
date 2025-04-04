import { useParams } from 'react-router-dom';

const GigDetail = () => {
  const { id } = useParams();

  // TODO: Fetch actual gig data from backend
  const gig = {
    id,
    title: 'Lead Actor for Theater Production',
    company: 'Broadway Theater Company',
    location: 'New York, NY',
    type: 'Full-time',
    payRange: '$2000-$3000 per week',
    description: `We are seeking an experienced actor for the lead role in our upcoming production. The ideal candidate will have:

- 5+ years of professional theater experience
- Strong dramatic acting skills
- Excellent voice projection
- Ability to work collaboratively in an ensemble
- Availability for evening and weekend performances

The production will run for 3 months, with potential for extension.`,
    requirements: [
      "Bachelor's degree in Theater Arts or equivalent experience",
      'Previous lead role experience',
      'Strong physical stamina',
      'Excellent memorization skills',
      'Team player with positive attitude'
    ],
    benefits: [
      'Competitive pay',
      'Health insurance',
      'Performance bonuses',
      'Professional development opportunities'
    ],
    applicationDeadline: '2025-04-15',
    startDate: '2025-05-01',
    companyInfo: {
      name: 'Broadway Theater Company',
      description: 'One of New York\'s premier theater companies, known for producing innovative and compelling productions.',
      website: 'https://example.com',
      location: 'Theater District, New York'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{gig.title}</h1>
                <p className="text-gray-600 mt-1">{gig.company}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-gray-500">{gig.location}</span>
                  <span className="text-gray-500">{gig.type}</span>
                  <span className="text-gray-500">{gig.payRange}</span>
                </div>
              </div>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Apply Now
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="whitespace-pre-line">{gig.description}</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2">
                {gig.requirements.map((req, index) => (
                  <li key={index} className="text-gray-600">{req}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Benefits</h2>
              <ul className="list-disc pl-5 space-y-2">
                {gig.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-600">{benefit}</li>
                ))}
              </ul>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Application Deadline</h3>
                  <p className="text-gray-600">{new Date(gig.applicationDeadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Start Date</h3>
                  <p className="text-gray-600">{new Date(gig.startDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About {gig.companyInfo.name}</h2>
                <p className="text-gray-600 mb-4">{gig.companyInfo.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{gig.companyInfo.location}</span>
                  <a
                    href={gig.companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;

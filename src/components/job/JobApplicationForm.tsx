import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';

interface JobApplicationFormProps {
  jobId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

interface PortfolioLink {
  title: string;
  url: string;
  description: string;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobId, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLink[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    coverLetter: '',
    availability: '',
    expectedSalary: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data?.portfolioLinks) {
        setPortfolioLinks(response.data.portfolioLinks);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.response?.data?.error || 'Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_BASE_URL}/api/jobs/${jobId}/apply`,
        {
          ...formData,
          portfolioLinks: selectedLinks,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      onSubmit();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setError(error.response?.data?.error || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
        <textarea
          value={formData.coverLetter}
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Availability</label>
        <input
          type="text"
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          placeholder="e.g., Available immediately, evenings and weekends"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Expected Salary (Optional)</label>
        <input
          type="text"
          value={formData.expectedSalary}
          onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
          placeholder="e.g., $2000-$3000 per week"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Portfolio Items to Include
        </label>
        <div className="space-y-2">
          {portfolioLinks.map((link) => (
            <label key={link.url} className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedLinks.includes(link.url)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedLinks([...selectedLinks, link.url]);
                  } else {
                    setSelectedLinks(selectedLinks.filter(url => url !== link.url));
                  }
                }}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{link.title}</p>
                <p className="text-sm text-gray-500">{link.description}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {link.url}
                </a>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default JobApplicationForm;

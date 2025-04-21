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
    <form
      onSubmit={handleSubmit}
      className="bg-blue-50 border border-blue-100 rounded-xl shadow p-8 max-w-xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Apply for this Job</h2>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-900 font-medium mb-1">Cover Letter</label>
        <textarea
          className="w-full border border-blue-100 rounded-lg p-2 bg-cream-50 text-gray-900 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          rows={4}
          value={formData.coverLetter}
          onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-900 font-medium mb-1">Availability</label>
        <input
          className="w-full border border-blue-100 rounded-lg p-2 bg-cream-50 text-gray-900 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          type="text"
          value={formData.availability}
          onChange={e => setFormData({ ...formData, availability: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-900 font-medium mb-1">Expected Salary</label>
        <input
          className="w-full border border-blue-100 rounded-lg p-2 bg-cream-50 text-gray-900 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          type="text"
          value={formData.expectedSalary}
          onChange={e => setFormData({ ...formData, expectedSalary: e.target.value })}
        />
      </div>
      {portfolioLinks.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-900 font-medium mb-1">Select Portfolio Links</label>
          <div className="flex flex-col gap-2">
            {portfolioLinks.map(link => (
              <label key={link.url} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedLinks.includes(link.url)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedLinks([...selectedLinks, link.url]);
                    } else {
                      setSelectedLinks(selectedLinks.filter(url => url !== link.url));
                    }
                  }}
                />
                <span className="text-blue-500 font-medium">{link.title}</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">View</a>
                <span className="text-gray-500 text-xs">{link.description}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-cream-100 hover:bg-cream-200 text-gray-900 border border-blue-100 font-medium shadow-sm"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white font-semibold shadow-md border border-blue-400"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default JobApplicationForm;

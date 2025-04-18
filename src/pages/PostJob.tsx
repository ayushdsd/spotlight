import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  startDate: string;
  companyInfo: {
    name: string;
    description: string;
    website: string;
    location: string;
  };
}

const initialFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  category: 'acting',
  salary: '',
  description: '',
  requirements: [],
  benefits: [],
  applicationDeadline: '',
  startDate: '',
  companyInfo: {
    name: '',
    description: '',
    website: '',
    location: ''
  }
};

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only recruiters can post jobs
  if (!user || user.role !== 'recruiter') {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/jobs',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      navigate('/recruiter/listings');
    } catch (error: any) {
      console.error('Error posting job:', error);
      setError(error.response?.data?.error || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('companyInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit.trim()],
      });
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-gray-600">Create a new opportunity for talented artists</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Lead Actor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="acting">Acting</option>
                  <option value="music">Music</option>
                  <option value="dance">Dance</option>
                  <option value="theater">Theater</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. $50,000 - $70,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the role, responsibilities, and expectations..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add a requirement..."
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-gray-700">{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add a benefit..."
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-gray-700">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyInfo.name"
                  value={formData.companyInfo.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Website</label>
                <input
                  type="url"
                  name="companyInfo.website"
                  value={formData.companyInfo.website}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Location</label>
                <input
                  type="text"
                  name="companyInfo.location"
                  value={formData.companyInfo.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company Description</label>
              <textarea
                name="companyInfo.description"
                value={formData.companyInfo.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Tell us about your company..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;

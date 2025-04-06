import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  description: string;
  requirements: string;
  deadline: string;
  skills: string[];
}

const initialFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  category: 'acting',
  salary: '',
  description: '',
  requirements: '',
  deadline: '',
  skills: [],
};

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle job posting submission
    console.log('Job posted:', formData);
    navigate('/jobs');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  return (
    <DashboardLayout>
      <div className="perspective-1000">
        {/* Header Section */}
        <div className="mb-8 transform-style-3d hover:translate-z-2 transition-transform">
          <h1 className="text-3xl font-minimal font-bold text-gray-900 mb-2 animate-fade-in">Post a Job</h1>
          <p className="text-gray-600">Create a new opportunity for talented artists</p>
        </div>

        {/* Form Section */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm transform-style-3d hover:translate-z-2 transition-transform">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="transform-style-3d hover:translate-z-1 transition-transform">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Lead Actor, Dance Instructor"
                    />
                  </div>

                  <div className="transform-style-3d hover:translate-z-1 transition-transform">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="transform-style-3d hover:translate-z-1 transition-transform">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="transform-style-3d hover:translate-z-1 transition-transform">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. $50k - $70k"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="transform-style-3d hover:translate-z-1 transition-transform">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div className="transform-style-3d hover:translate-z-1 transition-transform">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="acting">Acting</option>
                      <option value="music">Music</option>
                      <option value="dance">Dance</option>
                      <option value="theater">Theater</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm transform-style-3d hover:translate-z-2 transition-transform">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Job Details</h2>
              
              <div className="space-y-4">
                <div className="transform-style-3d hover:translate-z-1 transition-transform">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the role, responsibilities, and expectations..."
                  />
                </div>

                <div className="transform-style-3d hover:translate-z-1 transition-transform">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List the required skills, experience, and qualifications..."
                  />
                </div>

                <div className="transform-style-3d hover:translate-z-1 transition-transform">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm transform-style-3d hover:translate-z-2 transition-transform">
              <h2 className="text-xl font-minimal font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a required skill..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end transform-style-3d hover:translate-z-2 transition-transform">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;

import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

interface JobFormData {
  title: string;
  type: string;
  location: string;
  remote: boolean;
  salaryMin: string;
  salaryMax: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  deadline: string;
  skills: string[];
}

const initialFormData: JobFormData = {
  title: '',
  type: 'Full-time',
  location: '',
  remote: false,
  salaryMin: '',
  salaryMax: '',
  description: '',
  requirements: [''],
  responsibilities: [''],
  benefits: [''],
  deadline: '',
  skills: [],
};

export default function PostJob() {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit job posting to backend
    console.log('Submitting job posting:', formData);
  };

  const handleArrayFieldChange = (
    field: 'requirements' | 'responsibilities' | 'benefits',
    index: number,
    value: string
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].map((item, i) => (i === index ? value : item)),
    });
  };

  const addArrayField = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayField = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-900">Post a New Job</h1>
          <p className="mt-2 text-dark-500">Create a new job listing to find the perfect talent.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Lead Actor for Theater Production"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Job Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Minimum Salary</label>
                <input
                  type="text"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., $2,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Maximum Salary</label>
                <input
                  type="text"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., $3,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Application Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark-900 mb-6">Job Description</h2>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the role and what you're looking for..."
            />
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark-900 mb-6">Requirements</h2>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add a requirement..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('requirements', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Requirement
            </button>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark-900 mb-6">Required Skills</h2>
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
                className="flex-1 px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    graduationYear: string;
  }[];
  socialLinks: {
    website: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

const initialFormData: ProfileFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  bio: 'Professional actor with 5+ years of experience in theater and film...',
  skills: ['Method Acting', 'Voice Acting', 'Stage Combat', 'Improvisation'],
  experience: [
    {
      title: 'Lead Actor',
      company: 'Broadway Theater',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Leading role in multiple productions...',
    },
  ],
  education: [
    {
      school: 'New York Academy of Dramatic Arts',
      degree: 'Bachelor of Fine Arts',
      field: 'Theater Arts',
      graduationYear: '2020',
    },
  ],
  socialLinks: {
    website: 'https://johndoe.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    instagram: 'https://instagram.com/johndoe',
  },
};

export default function Profile() {
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    // TODO: Save profile data to backend
    setIsEditing(false);
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark-900">Profile</h1>
            <p className="mt-2 text-dark-500">Manage your personal information and credentials.</p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isEditing
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'border border-primary-600 text-primary-600 hover:bg-primary-50'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Basic Info */}
          <div className="p-6 border-b border-dark-100">
            <h2 className="text-xl font-bold text-dark-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-dark-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-dark-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-dark-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-dark-50"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-6 border-b border-dark-100">
            <h2 className="text-xl font-bold text-dark-900 mb-4">Bio</h2>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-dark-50"
            />
          </div>

          {/* Skills */}
          <div className="p-6 border-b border-dark-100">
            <h2 className="text-xl font-bold text-dark-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-dark-900 mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData.socialLinks).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-dark-700 mb-2 capitalize">
                    {platform}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          [platform]: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-dark-50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

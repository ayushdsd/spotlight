import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import axios from 'axios';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  portfolioImages: string[];
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

const emptyFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  skills: [],
  portfolioImages: [],
  experience: [],
  education: [],
  socialLinks: {
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  },
};

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>(emptyFormData);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    } else {
      setLoading(false);
      setError('Please log in to view your profile');
    }
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        setFormData(response.data);
      } else {
        setError('No profile data found');
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError(error.response?.data?.error || 'Error loading profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | null) => {
    if (e) {
      e.preventDefault();
    }
    if (!user?.id) {
      setError('Please log in to update your profile');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Only show success message if this was triggered by a form submit
      if (e) {
        alert('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Error updating profile. Please try again.');
      throw error; // Re-throw to handle in the upload function
    } finally {
      setSaving(false);
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/upload/portfolio-images', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.portfolioImages) {
        setFormData(prev => ({
          ...prev,
          portfolioImages: response.data.portfolioImages,
        }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error uploading portfolio images:', error);
      setError(error.response?.data?.error || 'Error uploading images. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePortfolioImage = async (index: number) => {
    try {
      setSaving(true);
      setError(null);
      const updatedImages = formData.portfolioImages.filter((_, i) => i !== index);
      
      setFormData(prev => ({
        ...prev,
        portfolioImages: updatedImages,
      }));

      await handleSubmit(null as any);
    } catch (error: any) {
      console.error('Error removing portfolio image:', error);
      setError(error.response?.data?.error || 'Error removing image. Please try again.');
      // Restore the image if save failed
      setFormData(prev => ({
        ...prev,
        portfolioImages: [...prev.portfolioImages],
      }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="perspective-1000">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
              <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
              <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePortfolioUpload}
                    multiple
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploading || saving}
                  />
                </div>

                {(uploading || saving) && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-500">
                      {uploading ? 'Uploading...' : 'Saving...'}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.portfolioImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative group transform hover:scale-105 transition-transform duration-300"
                    >
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removePortfolioImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        disabled={saving}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                disabled={uploading || saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

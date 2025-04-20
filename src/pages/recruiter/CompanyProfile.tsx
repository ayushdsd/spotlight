import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';

interface CompanyProfileData {
  name: string;
  logo?: string;
  description: string;
  industry: string;
  location: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  gallery?: string[];
  contactEmail?: string;
}

const emptyCompanyProfile: CompanyProfileData = {
  name: '',
  logo: '',
  description: '',
  industry: '',
  location: '',
  website: '',
  socialLinks: {},
  gallery: [],
  contactEmail: '',
};

export default function CompanyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CompanyProfileData>(emptyCompanyProfile);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_BASE_URL}/api/company-profile`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        setProfile(data);
      } catch (err: any) {
        setError('Could not load company profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(field: keyof CompanyProfileData, value: any) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      // Attach Authorization header with JWT token
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/company-profile`,
        profile,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      setEditMode(false);
    } catch (err: any) {
      setError('Could not save company profile');
    } finally {
      setLoading(false);
    }
  }

  function handleGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // For demo: use local object URL. Replace with upload logic as needed.
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setProfile((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ...newImages] }));
  }

  if (loading) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="p-8 text-red-600">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 mt-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-6">
            {profile.logo ? (
              <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-gray-500">{profile.name.charAt(0)}</span>
            )}
          </div>
          <div>
            {editMode ? (
              <input
                type="text"
                value={profile.name}
                onChange={e => handleChange('name', e.target.value)}
                className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-400"
              />
            ) : (
              <h1 className="text-2xl font-bold">{profile.name}</h1>
            )}
            <div className="text-gray-500 mt-1">{editMode ? (
              <input
                type="text"
                value={profile.industry}
                onChange={e => handleChange('industry', e.target.value)}
                className="border-b border-gray-300 focus:outline-none focus:border-blue-400"
                placeholder="Industry"
              />
            ) : (
              profile.industry
            )}</div>
            <div className="text-gray-500 mt-1">{editMode ? (
              <input
                type="text"
                value={profile.location}
                onChange={e => handleChange('location', e.target.value)}
                className="border-b border-gray-300 focus:outline-none focus:border-blue-400"
                placeholder="Location"
              />
            ) : (
              profile.location
            )}</div>
          </div>
          {user?.role === 'recruiter' && (
            <button
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          )}
        </div>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">About</h2>
          {editMode ? (
            <textarea
              value={profile.description}
              onChange={e => handleChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-400"
              rows={3}
            />
          ) : (
            <p>{profile.description}</p>
          )}
        </div>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Website & Socials</h2>
          {editMode ? (
            <>
              <input
                type="text"
                value={profile.website}
                onChange={e => handleChange('website', e.target.value)}
                className="w-full border-b border-gray-300 mb-2 focus:outline-none focus:border-blue-400"
                placeholder="Website"
              />
              <input
                type="text"
                value={profile.socialLinks?.linkedin || ''}
                onChange={e => handleChange('socialLinks', { ...profile.socialLinks, linkedin: e.target.value })}
                className="w-full border-b border-gray-300 mb-2 focus:outline-none focus:border-blue-400"
                placeholder="LinkedIn"
              />
              <input
                type="text"
                value={profile.socialLinks?.twitter || ''}
                onChange={e => handleChange('socialLinks', { ...profile.socialLinks, twitter: e.target.value })}
                className="w-full border-b border-gray-300 mb-2 focus:outline-none focus:border-blue-400"
                placeholder="Twitter"
              />
              <input
                type="text"
                value={profile.socialLinks?.facebook || ''}
                onChange={e => handleChange('socialLinks', { ...profile.socialLinks, facebook: e.target.value })}
                className="w-full border-b border-gray-300 mb-2 focus:outline-none focus:border-blue-400"
                placeholder="Facebook"
              />
              <input
                type="text"
                value={profile.socialLinks?.instagram || ''}
                onChange={e => handleChange('socialLinks', { ...profile.socialLinks, instagram: e.target.value })}
                className="w-full border-b border-gray-300 mb-2 focus:outline-none focus:border-blue-400"
                placeholder="Instagram"
              />
            </>
          ) : (
            <div className="space-y-1">
              {profile.website && <a href={profile.website} className="text-blue-600 hover:underline block" target="_blank" rel="noopener noreferrer">{profile.website}</a>}
              {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} className="text-blue-600 hover:underline block" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} className="text-blue-600 hover:underline block" target="_blank" rel="noopener noreferrer">Twitter</a>}
              {profile.socialLinks?.facebook && <a href={profile.socialLinks.facebook} className="text-blue-600 hover:underline block" target="_blank" rel="noopener noreferrer">Facebook</a>}
              {profile.socialLinks?.instagram && <a href={profile.socialLinks.instagram} className="text-blue-600 hover:underline block" target="_blank" rel="noopener noreferrer">Instagram</a>}
            </div>
          )}
        </div>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Contact Email</h2>
          {editMode ? (
            <input
              type="email"
              value={profile.contactEmail}
              onChange={e => handleChange('contactEmail', e.target.value)}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-400"
              placeholder="Contact Email"
            />
          ) : (
            <p>{profile.contactEmail}</p>
          )}
        </div>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Gallery</h2>
          {editMode && (
            <div className="mb-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryAdd}
                className="block mb-2"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {profile.gallery && profile.gallery.length > 0 ? (
              profile.gallery.map((img, idx) => (
                <img key={idx} src={img} alt="Gallery" className="w-24 h-24 object-cover rounded" />
              ))
            ) : (
              <span className="text-gray-400">No images yet</span>
            )}
          </div>
        </div>
        {editMode && (
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

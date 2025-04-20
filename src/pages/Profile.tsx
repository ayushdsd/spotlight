import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import PortfolioLinkForm from '../components/profile/PortfolioLinkForm';
import axios from 'axios';
import PostItem from '../components/common/PostItem';
import { API_BASE_URL } from '../utils/api';
import { useParams, useSearchParams } from 'react-router-dom';

// --- Types ---
interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  portfolioLinks: {
    title: string;
    url: string;
    description: string;
  }[];
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
  actorDetails: {
    height?: string;
    weight?: string;
    eyeColor?: string;
    hairColor?: string;
    specialSkills?: string[];
  };
  profilePicture?: string;
  portfolioImages?: string[];
}

const emptyFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  skills: [],
  portfolioLinks: [],
  experience: [],
  education: [],
  socialLinks: {
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  },
  actorDetails: {
    height: '',
    weight: '',
    eyeColor: '',
    hairColor: '',
    specialSkills: [],
  },
  profilePicture: '',
  portfolioImages: [],
};

export default function Profile() {
  const { user } = useAuth();
  const { userId: profileUserId } = useParams();
  const [searchParams] = useSearchParams();
  const queryView = searchParams.get('view');
  const isOwnProfile = !profileUserId || profileUserId === user?._id || profileUserId === user?.id;
  const userId = isOwnProfile ? (user?._id || user?.id) : profileUserId;
  const [formData, setFormData] = useState<ProfileFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  // If viewing someone else's profile, default to recruiter view
  const [viewMode, setViewMode] = useState<'edit' | 'recruiter'>(queryView === 'edit' ? 'edit' : (!isOwnProfile ? 'recruiter' : 'edit'));
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  // --- FOLLOW STATE ---
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
    } else {
      setLoading(false);
      setError('Please log in to view your profile');
    }
  }, [userId]);

  // Update view mode if query param changes
  useEffect(() => {
    if (!isOwnProfile && queryView === 'edit') setViewMode('edit');
    else if (!isOwnProfile) setViewMode('recruiter');
    else if (queryView === 'recruiter') setViewMode('recruiter');
    else setViewMode('edit');
  }, [queryView, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile && userId) {
      fetchFollowStatus();
    }
  }, [userId, isOwnProfile]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const url = isOwnProfile
        ? `${API_BASE_URL}/api/users/profile`
        : `${API_BASE_URL}/api/users/${userId}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data) {
        setFormData({ ...emptyFormData, ...response.data });
      } else {
        setError('No profile data found');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error loading profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);
      const token = localStorage.getItem('token');
      const url = isOwnProfile
        ? `${API_BASE_URL}/api/users/${userId}/posts`
        : `${API_BASE_URL}/api/users/${userId}/posts`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.posts || []);
    } catch (err: any) {
      setPostsError(err.response?.data?.error || 'Error loading posts');
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchFollowStatus = async () => {
    try {
      setFollowLoading(true);
      const token = localStorage.getItem('token');
      // Assume API returns { isFollowing: boolean, isFollowedBy: boolean }
      const res = await axios.get(`${API_BASE_URL}/api/users/${userId}/follow-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      setIsFollowing(false);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/users/${userId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(true);
    } catch {}
    setFollowLoading(false);
  };

  const handleUnfollow = async () => {
    setFollowLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/users/${userId}/follow`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(false);
    } catch {}
    setFollowLoading(false);
  };

  // Only allow edit, upload, and delete on own profile
  const canDeletePost = isOwnProfile;

  const handleChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingPhoto(true);
    setError(null);
    const file = e.target.files[0];
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('file', file); // <-- field name must match backend
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/profile/picture`, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setFormData(prev => ({ ...prev, profilePicture: res.data.url }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error uploading photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePortfolioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingPhoto(true);
    setError(null);
    const file = e.target.files[0];
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setFormData(prev => ({
        ...prev,
        portfolioImages: [...(prev.portfolioImages || []), res.data.url],
      }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error uploading image');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE_URL}/api/users/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchUserProfile();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // --- DELETE POST HANDLER ---
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/feed/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts => posts.filter((p: any) => p._id !== postId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  // --- RENDER ---
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex gap-2">
            {!isOwnProfile && (
              <button
                className={`px-4 py-2 rounded font-semibold transition ${isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                disabled={followLoading}
                onClick={isFollowing ? handleUnfollow : handleFollow}
              >
                {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              onClick={() => setViewMode(viewMode === 'edit' ? 'recruiter' : 'edit')}
              disabled={!isOwnProfile}
            >
              {viewMode === 'edit' ? 'View as Recruiter' : 'Edit Profile'}
            </button>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {viewMode === 'edit' ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded shadow space-y-4">
              <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>First Name</label>
                  <input type="text" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} className="input" />
                </div>
                <div>
                  <label>Last Name</label>
                  <input type="text" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} className="input" />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="input" disabled />
                </div>
                <div>
                  <label>Phone</label>
                  <input type="text" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="input" />
                </div>
                <div>
                  <label>Location</label>
                  <input type="text" value={formData.location} onChange={e => handleChange('location', e.target.value)} className="input" />
                </div>
                <div>
                  <label>Bio</label>
                  <textarea value={formData.bio} onChange={e => handleChange('bio', e.target.value)} className="input" />
                </div>
              </div>
            </div>
            {/* Actor Details */}
            <div className="bg-white p-6 rounded shadow space-y-4">
              <h2 className="text-xl font-semibold mb-2">Physical Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Height</label>
                  <input type="text" value={formData.actorDetails?.height || ''} onChange={e => setFormData(prev => ({ ...prev, actorDetails: { ...prev.actorDetails, height: e.target.value } }))} className="input" />
                </div>
                <div>
                  <label>Weight</label>
                  <input type="text" value={formData.actorDetails?.weight || ''} onChange={e => setFormData(prev => ({ ...prev, actorDetails: { ...prev.actorDetails, weight: e.target.value } }))} className="input" />
                </div>
                <div>
                  <label>Eye Color</label>
                  <input type="text" value={formData.actorDetails?.eyeColor || ''} onChange={e => setFormData(prev => ({ ...prev, actorDetails: { ...prev.actorDetails, eyeColor: e.target.value } }))} className="input" />
                </div>
                <div>
                  <label>Hair Color</label>
                  <input type="text" value={formData.actorDetails?.hairColor || ''} onChange={e => setFormData(prev => ({ ...prev, actorDetails: { ...prev.actorDetails, hairColor: e.target.value } }))} className="input" />
                </div>
                <div className="col-span-2">
                  <label>Special Skills (comma separated)</label>
                  <input type="text" value={formData.actorDetails?.specialSkills?.join(', ') || ''} onChange={e => setFormData(prev => ({ ...prev, actorDetails: { ...prev.actorDetails, specialSkills: e.target.value.split(',').map(s => s.trim()) } }))} className="input" />
                </div>
              </div>
            </div>
            {/* Photo Upload */}
            <div className="bg-white p-6 rounded shadow space-y-4">
              <h2 className="text-xl font-semibold mb-2">Profile Photo</h2>
              <div className="flex items-center space-x-4">
                {formData.profilePicture && <img src={formData.profilePicture} alt="Profile" className="h-24 w-24 rounded-full object-cover border" />}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                {uploadingPhoto && <span>Uploading...</span>}
              </div>
            </div>
            {/* Portfolio Images */}
            <div className="bg-white p-6 rounded shadow space-y-4">
              <h2 className="text-xl font-semibold mb-2">Portfolio Images</h2>
              <div className="flex flex-wrap gap-4">
                {(formData.portfolioImages || []).map((img, idx) => (
                  <img key={idx} src={img} alt="Portfolio" className="h-24 w-24 object-cover border rounded" />
                ))}
                <input type="file" accept="image/*" onChange={handlePortfolioImageUpload} disabled={uploadingPhoto} />
              </div>
            </div>
            {/* Portfolio Links */}
            <div className="bg-white p-6 rounded shadow space-y-4">
              <h2 className="text-xl font-semibold mb-2">Portfolio Links</h2>
              <div className="mb-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setShowLinkForm(true)}
                >
                  Add Portfolio Link
                </button>
              </div>
              {showLinkForm && (
                <PortfolioLinkForm
                  onSubmit={link => {
                    setFormData(prev => ({ ...prev, portfolioLinks: [...(prev.portfolioLinks || []), link] }));
                    setShowLinkForm(false);
                  }}
                  onCancel={() => setShowLinkForm(false)}
                />
              )}
              <ul>
                {(formData.portfolioLinks || []).map((link, idx) => (
                  <li key={idx} className="mb-2">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">{link.title}</a>
                    <span className="ml-2 text-gray-600">{link.description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        ) : (
          // Recruiter View
          <div className="bg-white p-8 rounded shadow space-y-8">
            <div className="flex items-center space-x-6">
              {formData.profilePicture && <img src={formData.profilePicture} alt="Profile" className="h-28 w-28 rounded-full object-cover border" />}
              <div>
                <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                <div className="text-gray-600">{formData.bio}</div>
                <div className="text-gray-500 text-sm">{formData.location}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Physical Details</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                <div><span className="font-medium">Height:</span> {formData.actorDetails?.height}</div>
                <div><span className="font-medium">Weight:</span> {formData.actorDetails?.weight}</div>
                <div><span className="font-medium">Eye Color:</span> {formData.actorDetails?.eyeColor}</div>
                <div><span className="font-medium">Hair Color:</span> {formData.actorDetails?.hairColor}</div>
                <div className="col-span-2"><span className="font-medium">Special Skills:</span> {(formData.actorDetails?.specialSkills || []).join(', ')}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Portfolio Images</h3>
              <div className="flex flex-wrap gap-4">
                {(formData.portfolioImages || []).map((img, idx) => (
                  <img key={idx} src={img} alt="Portfolio" className="h-24 w-24 object-cover border rounded" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Portfolio Links</h3>
              <ul>
                {(formData.portfolioLinks || []).map((link, idx) => (
                  <li key={idx} className="mb-2">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">{link.title}</a>
                    <span className="ml-2 text-gray-600">{link.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* User Feed Posts */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">My Posts</h2>
          {postsLoading && <div className="text-gray-500">Loading...</div>}
          {postsError && <div className="text-red-600">{postsError}</div>}
          {posts.length === 0 && !postsLoading && (
            <div className="text-gray-400">You haven't posted anything yet.</div>
          )}
          <div className="space-y-6">
            {posts.map((post: any) => (
              <PostItem key={post._id} post={post} onDelete={canDeletePost ? handleDeletePost : undefined} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Add some basic styling for .input
// You can move this to your CSS file
const inputStyle = document.createElement('style');
inputStyle.innerHTML = `.input { width: 100%; padding: 0.5rem; border-radius: 0.375rem; border: 1px solid #d1d5db; margin-top: 0.25rem; margin-bottom: 0.5rem; }`;
document.head.appendChild(inputStyle);

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../pages/Feed';
import { API_BASE_URL } from '../../utils/api';

interface PostComposerProps {
  onPost: (post: Post) => void;
}

const PostComposer = ({ onPost }: PostComposerProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);
      const response = await axios.post(
        `${API_BASE_URL}/api/feed`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      setImage(null);
      setImagePreview(null);
      onPost(response.data.post);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error posting');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
      <textarea
        className="w-full rounded border border-gray-200 p-2 resize-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder="Share something..."
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={loading}
      />
      {imagePreview && (
        <div className="relative mt-2">
          <img src={imagePreview} alt="Preview" className="h-32 w-auto rounded border mx-auto" />
          <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">Remove</button>
        </div>
      )}
      <div className="flex items-center gap-3 mt-2">
        <label className="flex items-center cursor-pointer text-blue-600 font-medium">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <span className="inline-block px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 transition">Add Image</span>
        </label>
        {/* Add more options here if needed */}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || (!content.trim() && !image)}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default PostComposer;

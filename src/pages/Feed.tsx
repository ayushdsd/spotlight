import { useEffect, useState, useRef, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PostComposer from '../components/common/PostComposer';
import PostItem from '../components/common/PostItem';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: string;
  };
  content: string;
  imageUrl?: string;
  createdAt: string;
}

const PAGE_SIZE = 10;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_BASE_URL}/api/feed?page=${page}&limit=${PAGE_SIZE}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(prev =>
          page === 1 ? response.data.posts : [...prev, ...response.data.posts]
        );
        setHasMore(response.data.posts.length === PAGE_SIZE);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error loading feed');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const handleNewPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Feed</h1>
        <PostComposer onPost={handleNewPost} />
        <div className="space-y-6 mt-8">
          {posts.map((post, i) => (
            <div
              key={post._id}
              ref={i === posts.length - 1 ? lastPostRef : undefined}
            >
              <PostItem post={post} />
            </div>
          ))}
          {loading && <div className="text-center text-gray-500">Loading...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}
          {!loading && !hasMore && posts.length > 0 && (
            <div className="text-center text-gray-400">No more posts</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feed;

import { useEffect, useState, useRef, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PostComposer from '../components/common/PostComposer';
import PostItem from '../components/common/PostItem';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../utils/api';

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: string[];
  comments: Array<{
    user: {
      _id: string;
      name: string;
      picture?: string;
    };
    text: string;
    createdAt: string;
  }>;
}

const PAGE_SIZE = 10;

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
      <div className="w-full py-8 px-0 sm:px-2 bg-cream-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Feed</h1>
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
          {loading && <div className="text-center text-blue-500">Loading...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}
          {!loading && !hasMore && posts.length > 0 && (
            <div className="text-center text-blue-300">No more posts</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feed;

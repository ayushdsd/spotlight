import { Post } from '../../pages/Feed';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart, FaRegComment, FaShare } from 'react-icons/fa';
import { API_BASE_URL } from '../../utils/api';

interface PostItemProps {
  post: Post;
  onDelete?: (id: string) => void;
}

const PostItem = ({ post, onDelete }: PostItemProps) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const isOwner = userId && post.author && String(post.author._id) === String(userId);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Engagement state
  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(() => (userId ? post.likes.includes(userId) : false));
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [likeAnim, setLikeAnim] = useState(false);
  const [commentAnim, setCommentAnim] = useState(false);

  useEffect(() => {
    setLikes(post.likes || []);
    setLiked(userId ? post.likes.includes(userId) : false);
    setComments(post.comments || []);
  }, [post.likes, post.comments, userId]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/feed/${post._id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setLikes(res.data.likes);
      setLiked(res.data.liked);
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 400);
    } catch (err) {
      // Optionally show error
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/feed/${post._id}/comment`, { text: commentText }, { headers: { Authorization: `Bearer ${token}` } });
      setComments(res.data.comments);
      setCommentText('');
      setCommentAnim(true);
      setTimeout(() => setCommentAnim(false), 400);
    } catch (err) {
      // Optionally show error
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + `/post/${post._id}`);
      setShareMsg('Link copied!');
      setSharing(true);
      setTimeout(() => { setSharing(false); setShareMsg(''); }, 1500);
    } catch {
      setShareMsg('Failed to copy');
      setSharing(true);
      setTimeout(() => { setSharing(false); setShareMsg(''); }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-0 sm:px-4 relative border border-cream-100 mb-4">
      <div className="flex items-center gap-3 mb-2 ml-2 mt-2">
        {post.author.picture ? (
          <img
            src={post.author.picture}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <span className="text-lg text-blue-500">{post.author.name.charAt(0)}</span>
          </div>
        )}
        <div className="ml-1 mt-1">
          <div className="font-semibold text-blue-900 cursor-pointer hover:underline"
               onClick={() => window.location.href = `/profile/${post.author._id}?view=recruiter`}>
            {(post.author.firstName && post.author.lastName && `${post.author.firstName} ${post.author.lastName}`) || post.author.name}
          </div>
          <div className="text-xs text-blue-400">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
        {isOwner && onDelete && (
          <div className="ml-auto relative flex items-center" ref={dropdownRef}>
            <button
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
               style={{ minWidth: 32, minHeight: 32, fontSize: 24, lineHeight: 1 }}
               onClick={() => setDropdownOpen((open) => !open)}
              aria-label="Post Actions"
            >
              &#8942;
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-blue-100 rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                   onClick={() => { onDelete(post._id); setDropdownOpen(false); }}
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mb-2 whitespace-pre-line text-left text-blue-900 text-base px-2">{post.content}</div>
      {post.imageUrl && (
        <div className="w-full flex justify-center my-2">
          <div className="aspect-[4/5] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden rounded border border-cream-100 bg-cream-50">
            <img
              src={post.imageUrl}
              alt="Post"
              className="object-cover w-full h-full"
              style={{ aspectRatio: '4 / 5', display: 'block' }}
            />
          </div>
        </div>
      )}
      {/* Engagement Bar */}
      <div className="flex items-center gap-4 px-2 py-2 border-t border-cream-100 mt-2">
        <button
          className={`flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none transition-transform duration-200 ${likeAnim ? 'scale-125 animate-pulse' : ''}`}
          onClick={handleLike}
          aria-label="Like"
        >
          {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span className="text-sm font-medium">{likes.length}</span>
        </button>
        <button
          className={`flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none transition-transform duration-200 ${commentAnim ? 'scale-110 animate-pulse' : ''}`}
          onClick={() => setShowComments((v) => !v)}
          aria-label="Comment"
        >
          <FaRegComment />
          <span className="text-sm font-medium">{comments.length}</span>
        </button>
        <button
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none transition-transform duration-200"
          onClick={handleShare}
          aria-label="Share"
        >
          <FaShare />
          <span className="text-sm font-medium">Share</span>
        </button>
        {sharing && <span className="text-xs text-green-600 ml-2">{shareMsg}</span>}
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="px-2 py-2 border-t border-cream-100 bg-cream-50 rounded-b-xl">
          <form className="flex gap-2 mb-2" onSubmit={handleComment}>
            <input
              type="text"
              className="flex-1 rounded border border-blue-100 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={200}
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm transition-transform duration-200" disabled={!commentText.trim()}>
              Post
            </button>
          </form>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {comments.length === 0 && <div className="text-xs text-blue-400">No comments yet</div>}
            {comments.map((c, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {c.user?.picture ? (
                  <img src={c.user.picture} alt={c.user.name} className="w-7 h-7 rounded-full object-cover border border-blue-100" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center border border-blue-100">
                    <span className="text-sm text-blue-500">{c.user?.name?.charAt(0) || '?'}</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-blue-900">{c.user?.name || 'User'}</div>
                  <div className="text-xs text-blue-800 break-words">{c.text}</div>
                  <div className="text-[10px] text-blue-400">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;

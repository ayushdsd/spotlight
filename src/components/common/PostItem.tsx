import { Post } from '../../pages/Feed';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post, onDelete }: PostItemProps & { onDelete?: (id: string) => void }) => {
  const { user } = useAuth();
  const userId = user?._id; // Always use _id
  const isOwner = userId && post.author && post.author._id === userId;

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-white rounded-lg shadow p-4 relative">
      <div className="flex items-center gap-3 mb-2">
        {post.author.picture ? (
          <img
            src={post.author.picture}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg text-gray-500">{post.author.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900 cursor-pointer hover:underline"
               onClick={() => window.location.href = `/profile/${post.author._id}?view=recruiter`}>
            {post.author.name}
          </div>
          <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
        {isOwner && onDelete && (
          <div className="ml-auto relative" ref={dropdownRef}>
            <button
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="Post Actions"
            >
              ⋮
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  onClick={() => { onDelete(post._id); setDropdownOpen(false); }}
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mb-2 whitespace-pre-line">{post.content}</div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="max-h-80 w-auto rounded border mx-auto my-2" />
      )}
      {/* Media support can be added here */}
    </div>
  );
};

export default PostItem;

import { Post } from '../../pages/Feed';
import { useAuth } from '../../contexts/AuthContext';

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post, onDelete }: PostItemProps & { onDelete?: (id: string) => void }) => {
  const { user } = useAuth();
  const userId = user?._id; // Always use _id
  const isOwner = userId && post.author && post.author._id === userId;
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
          <button
            className="ml-auto px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition absolute top-2 right-2"
            onClick={() => onDelete(post._id)}
            aria-label="Delete Post"
          >
            Delete
          </button>
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

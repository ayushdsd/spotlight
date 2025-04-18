import { Post } from '../../pages/Feed';

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
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
          <div className="font-semibold text-gray-900">{post.author.name}</div>
          <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
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

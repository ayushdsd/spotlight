import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
}

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  comments: { type: [CommentSchema], default: [] },
});

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;

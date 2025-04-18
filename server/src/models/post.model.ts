import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;

import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'link';
  mediaUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  featured: boolean;
  order: number;
  stats: {
    views: number;
    likes: number;
  };
  metadata: {
    duration?: string;
    dimensions?: {
      width: number;
      height: number;
    };
    fileSize?: number;
    fileType?: string;
  };
  credits: Array<{
    name: string;
    role: string;
  }>;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: Date;
  updatedAt: Date;
}

const portfolioItemSchema = new Schema<IPortfolioItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['Acting', 'Music', 'Dance', 'Photography', 'Visual Arts', 'Writing', 'Other'],
    },
    type: {
      type: String,
      required: true,
      enum: ['image', 'video', 'audio', 'document', 'link'],
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 30,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
    },
    metadata: {
      duration: String,
      dimensions: {
        width: Number,
        height: Number,
      },
      fileSize: Number,
      fileType: String,
    },
    credits: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      role: {
        type: String,
        required: true,
        trim: true,
      },
    }],
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
portfolioItemSchema.index({ userId: 1, category: 1 });
portfolioItemSchema.index({ userId: 1, featured: 1 });
portfolioItemSchema.index({ userId: 1, tags: 1 });
portfolioItemSchema.index({ userId: 1, visibility: 1 });

// Virtual field for formatted date
portfolioItemSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Method to increment view count
portfolioItemSchema.methods.incrementViews = async function () {
  this.stats.views += 1;
  await this.save();
};

// Method to toggle like
portfolioItemSchema.methods.toggleLike = async function () {
  this.stats.likes = this.stats.likes > 0 ? this.stats.likes - 1 : this.stats.likes + 1;
  await this.save();
};

const PortfolioItem = mongoose.model<IPortfolioItem>('PortfolioItem', portfolioItemSchema);

export default PortfolioItem;

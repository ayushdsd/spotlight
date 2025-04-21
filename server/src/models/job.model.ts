import mongoose, { Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
  category: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string;
  skills: string[];
  deadline: Date;
  postedBy: mongoose.Types.ObjectId;
  status: 'open' | 'closed' | 'draft' | 'active' | 'inactive';
  applicants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema<IJob>({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  salary: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  deadline: {
    type: Date,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'draft', 'active', 'inactive'],
    default: 'open',
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create text index for search
jobSchema.index({
  title: 'text',
  description: 'text',
  company: 'text',
  skills: 'text',
});

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;

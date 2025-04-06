import { Schema, model, Document } from 'mongoose';

export interface IExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface IEducation {
  school: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface ISocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  role: 'artist' | 'recruiter';
  profilePicture?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills?: string[];
  portfolioImages?: string[];
  experience?: IExperience[];
  education?: IEducation[];
  socialLinks?: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['artist', 'recruiter'],
    required: true,
  },
  profilePicture: String,
  bio: String,
  location: String,
  phone: String,
  skills: [String],
  portfolioImages: [String],
  experience: [{
    title: String,
    company: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
  }],
  education: [{
    school: String,
    degree: String,
    field: String,
    graduationYear: String,
  }],
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String,
    instagram: String,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to update name from firstName and lastName
userSchema.pre('save', function(next) {
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  next();
});

export default model<IUser>('User', userSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyProfile extends Document {
  name: string;
  logo?: string;
  description: string;
  industry: string;
  location: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  gallery?: string[];
  contactEmail?: string;
  recruiter: mongoose.Types.ObjectId; // link to recruiter user
}

const CompanyProfileSchema = new Schema<ICompanyProfile>({
  name: { type: String, required: true },
  logo: String,
  description: String,
  industry: String,
  location: String,
  website: String,
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
  },
  gallery: [String],
  contactEmail: String,
  recruiter: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
});

export default mongoose.model<ICompanyProfile>('CompanyProfile', CompanyProfileSchema);

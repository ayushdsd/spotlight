import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  applicant: mongoose.Types.ObjectId; // user who applied
  job: mongoose.Types.ObjectId; // job reference
  coverLetter?: string;
  portfolioLinks?: string[];
  availability?: string;
  expectedSalary?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  coverLetter: String,
  portfolioLinks: [String],
  availability: String,
  expectedSalary: String,
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);

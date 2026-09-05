import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  student_id: mongoose.Types.ObjectId | string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  job_id: mongoose.Types.ObjectId | string;
  jobId?: string;
  jobTitle?: string;
  companyName?: string;
  match_percent: number;
  matchPercent?: number;
  status: 'Submitted' | 'Under Review' | 'Interviewing' | 'Applied' | 'Accepted' | 'Rejected';
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    student_id: { type: Schema.Types.Mixed, required: true, index: true },
    studentId: { type: String, trim: true },
    studentName: { type: String, trim: true, default: 'Candidate' },
    studentEmail: { type: String, trim: true, default: '' },
    job_id: { type: Schema.Types.Mixed, required: true, index: true },
    jobId: { type: String, trim: true },
    jobTitle: { type: String, trim: true, default: 'Software Engineer' },
    companyName: { type: String, trim: true, default: 'Tech Corp' },
    match_percent: { type: Number, required: true, min: 0, max: 100 },
    matchPercent: { type: Number, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Interviewing', 'Applied', 'Accepted', 'Rejected'],
      default: 'Submitted',
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);

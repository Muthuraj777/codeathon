import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  student_id: string;
  job_id: string;
  match_percent: number;
  status: 'Applied' | 'Review' | 'Interview' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    student_id: { type: String, required: true, index: true },
    job_id: { type: String, required: true, index: true },
    match_percent: { type: Number, required: true, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['Applied', 'Review', 'Interview', 'Accepted', 'Rejected'],
      default: 'Applied',
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);

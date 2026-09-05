import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  student_id: mongoose.Types.ObjectId | string;
  job_id: mongoose.Types.ObjectId | string;
  match_percent: number;
  status: 'Applied' | 'Review' | 'Interview' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    student_id: { type: Schema.Types.Mixed, required: true, index: true },
    job_id: { type: Schema.Types.Mixed, required: true, index: true },
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

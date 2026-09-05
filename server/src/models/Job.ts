import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  job_id: string;
  company: string;
  title: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    job_id: { type: String, required: true, unique: true, index: true, trim: true },
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);

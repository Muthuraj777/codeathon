import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  company: string;
  title: string;
  location: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters long'],
      maxlength: [100, 'Company name cannot exceed 100 characters'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [2, 'Job title must be at least 2 characters long'],
      maxlength: [100, 'Job title cannot exceed 100 characters'],
      index: true,
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);

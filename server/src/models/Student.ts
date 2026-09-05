import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  jobTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Student / Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      index: true,
    },
    jobTitle: {
      type: String,
      trim: true,
      default: 'Full Stack Developer',
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);

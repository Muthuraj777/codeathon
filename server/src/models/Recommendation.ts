import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  student_id: mongoose.Types.ObjectId;
  job_id: mongoose.Types.ObjectId;
  skill_id: mongoose.Types.ObjectId;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  current_level: number;
  target_level: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
      index: true,
    },
    skill_id: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'Skill ID is required'],
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    current_level: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    target_level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint per student, job, and skill recommendation
RecommendationSchema.index({ student_id: 1, job_id: 1, skill_id: 1 }, { unique: true });

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);

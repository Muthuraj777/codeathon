import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  student_id: string;
  job_id: string;
  skill_id: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  current_level: number;
  target_level: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    student_id: { type: String, required: true, index: true },
    job_id: { type: String, required: true, index: true },
    skill_id: { type: String, required: true, index: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    reason: { type: String, required: true },
    current_level: { type: Number, required: true },
    target_level: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);

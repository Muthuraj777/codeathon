import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  student_id: mongoose.Types.ObjectId | string;
  job_id: mongoose.Types.ObjectId | string;
  skill_id: mongoose.Types.ObjectId | string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  current_level: number;
  target_level: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    student_id: { type: Schema.Types.Mixed, required: true, index: true },
    job_id: { type: Schema.Types.Mixed, required: true, index: true },
    skill_id: { type: Schema.Types.Mixed, required: true, index: true },
    priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true },
    reason: { type: String, required: true },
    current_level: { type: Number, required: true },
    target_level: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);

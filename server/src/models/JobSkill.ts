import mongoose, { Schema, Document } from 'mongoose';

export interface IJobSkill extends Document {
  job_id: string;
  skill_id: string;
  required_level: number;
  mandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSkillSchema: Schema = new Schema(
  {
    job_id: { type: String, required: true, index: true, trim: true },
    skill_id: { type: String, required: true, index: true, trim: true },
    required_level: { type: Number, required: true, min: 1, max: 5 },
    mandatory: { type: Boolean, default: true },
  },
  { timestamps: true }
);

JobSkillSchema.index({ job_id: 1, skill_id: 1 }, { unique: true });

export const JobSkill = mongoose.model<IJobSkill>('JobSkill', JobSkillSchema);

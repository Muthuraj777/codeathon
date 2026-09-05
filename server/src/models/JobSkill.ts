import mongoose, { Document, Schema } from 'mongoose';

export interface IJobSkill extends Document {
  job_id: mongoose.Types.ObjectId;
  skill_id: mongoose.Types.ObjectId;
  required_level: number; // 1: Beginner to 5: Expert
  mandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSkillSchema = new Schema<IJobSkill>(
  {
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
      index: true,
    },
    required_level: {
      type: Number,
      required: [true, 'Required proficiency level is required'],
      min: [1, 'Required level must be at least 1'],
      max: [5, 'Required level cannot exceed 5'],
      default: 1,
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate skill requirement entries for the same job
JobSkillSchema.index({ job_id: 1, skill_id: 1 }, { unique: true });

export const JobSkill = mongoose.model<IJobSkill>('JobSkill', JobSkillSchema);

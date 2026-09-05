import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  skill_id?: string;
  name: string;
  category: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    skill_id: {
      type: String,
      sparse: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Skill name must be at least 2 characters long'],
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      trim: true,
      enum: {
        values: ['Backend', 'Frontend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'AI/ML', 'Other', 'General'],
        message: '{VALUE} is not a supported category',
      },
      default: 'Other',
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);

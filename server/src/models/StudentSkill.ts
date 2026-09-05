import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentSkill extends Document {
  student_id: mongoose.Types.ObjectId;
  skill_id: mongoose.Types.ObjectId;
  proficiency: number; // 1: Beginner, 2: Basic, 3: Intermediate, 4: Advanced, 5: Expert
  createdAt: Date;
  updatedAt: Date;
}

const StudentSkillSchema = new Schema<IStudentSkill>(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    skill_id: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'Skill ID is required'],
      index: true,
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency level is required'],
      min: [1, 'Proficiency must be at least 1 (Beginner)'],
      max: [5, 'Proficiency cannot exceed 5 (Expert)'],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student cannot have duplicate skill records
StudentSkillSchema.index({ student_id: 1, skill_id: 1 }, { unique: true });

export const StudentSkill = mongoose.model<IStudentSkill>('StudentSkill', StudentSkillSchema);

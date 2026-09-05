import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentSkill extends Document {
  student_id: string;
  skill_id: string;
  proficiency: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSkillSchema: Schema = new Schema(
  {
    student_id: { type: String, required: true, index: true, trim: true },
    skill_id: { type: String, required: true, index: true, trim: true },
    proficiency: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

StudentSkillSchema.index({ student_id: 1, skill_id: 1 }, { unique: true });

export const StudentSkill = mongoose.model<IStudentSkill>('StudentSkill', StudentSkillSchema);

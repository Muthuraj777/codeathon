import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Student } from '../models/Student.js';
import { StudentSkill } from '../models/StudentSkill.js';
import { Skill } from '../models/Skill.js';

export const createStudentSchema = z.object({
  student_id: z.string().min(1, 'student_id is required'),
  name: z.string().min(1, 'name is required'),
  email: z.string().email('valid email is required'),
});

export const addStudentSkillSchema = z.object({
  skill_id: z.string().min(1, 'skill_id is required'),
  proficiency: z.number().int().min(1).max(5),
});

export class StudentController {
  public static async createStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await Student.create(req.body);
      res.status(201).json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const students = await Student.find().lean();
      res.status(200).json({ success: true, data: students });
    } catch (error) {
      next(error);
    }
  }

  public static async getStudentSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const student = await Student.findOne({ student_id: id });
      if (!student) {
        res.status(404).json({ success: false, error: { message: `Student '${id}' not found` } });
        return;
      }

      const skills = await StudentSkill.find({ student_id: id }).lean();
      const skillIds = skills.map((s) => s.skill_id);
      const skillEntities = await Skill.find({ skill_id: { $in: skillIds } }).lean();
      const skillMap = new Map(skillEntities.map((s) => [s.skill_id, s]));

      const enrichedSkills = skills.map((s) => ({
        ...s,
        name: skillMap.get(s.skill_id)?.name || s.skill_id,
        category: skillMap.get(s.skill_id)?.category || 'General',
      }));

      res.status(200).json({ success: true, data: enrichedSkills });
    } catch (error) {
      next(error);
    }
  }

  public static async addOrUpdateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { skill_id, proficiency } = req.body;

      const student = await Student.findOne({ student_id: id });
      if (!student) {
        res.status(404).json({ success: false, error: { message: `Student '${id}' not found` } });
        return;
      }

      const skillRecord = await StudentSkill.findOneAndUpdate(
        { student_id: id, skill_id },
        { student_id: id, skill_id, proficiency },
        { upsert: true, returnDocument: 'after' }
      );

      res.status(200).json({ success: true, data: skillRecord });
    } catch (error) {
      next(error);
    }
  }
}

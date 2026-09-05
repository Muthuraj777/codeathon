import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student.js';
import { StudentSkill } from '../models/StudentSkill.js';
import { Skill } from '../models/Skill.js';
import { createStudentSchema, updateStudentSchema, addOrUpdateStudentSkillSchema } from '../validations/studentValidation.js';

export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createStudentSchema.parse(req.body);

    const existingStudent = await Student.findOne({ email: validated.email });
    if (existingStudent) {
      res.status(400).json({ status: 'fail', message: 'Student with this email already exists.' });
      return;
    }

    const student = await Student.create(validated);

    res.status(201).json({
      status: 'success',
      data: { student },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query;

    const query: any = {};
    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query).sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      res.status(404).json({ status: 'fail', message: 'Student not found.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { student },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validated = updateStudentSchema.parse(req.body);

    if (validated.email) {
      const existing = await Student.findOne({ email: validated.email, _id: { $ne: id } });
      if (existing) {
        res.status(400).json({ status: 'fail', message: 'Another student with this email already exists.' });
        return;
      }
    }

    const student = await Student.findByIdAndUpdate(id, validated, { new: true, runValidators: true });
    if (!student) {
      res.status(404).json({ status: 'fail', message: 'Student not found.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { student },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      res.status(404).json({ status: 'fail', message: 'Student not found.' });
      return;
    }

    // Clean up associated skills
    await StudentSkill.deleteMany({ student_id: id });

    res.status(200).json({
      status: 'success',
      message: 'Student and associated skill ratings deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Skill Proficiency Management Endpoint: GET /api/students/:id/skills
export const getStudentSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({ status: 'fail', message: 'Student not found.' });
      return;
    }

    const studentSkills = await StudentSkill.find({ student_id: id }).populate('skill_id');

    res.status(200).json({
      status: 'success',
      results: studentSkills.length,
      data: {
        student,
        skills: studentSkills.map((item: any) => ({
          id: item._id,
          skillId: item.skill_id?._id || item.skill_id,
          name: item.skill_id?.name || 'Unknown',
          category: item.skill_id?.category || 'Other',
          proficiency: item.proficiency,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Skill Proficiency Management Endpoint: POST /api/students/:id/skills
export const addOrUpdateStudentSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validated = addOrUpdateStudentSkillSchema.parse(req.body);

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({ status: 'fail', message: 'Student not found.' });
      return;
    }

    const skill = await Skill.findById(validated.skill_id);
    if (!skill) {
      res.status(404).json({ status: 'fail', message: 'Skill not found in catalog.' });
      return;
    }

    const studentSkill = await StudentSkill.findOneAndUpdate(
      { student_id: id, skill_id: validated.skill_id },
      { proficiency: validated.proficiency },
      { new: true, upsert: true, runValidators: true }
    ).populate('skill_id');

    res.status(200).json({
      status: 'success',
      data: {
        studentSkill: {
          id: studentSkill._id,
          skillId: (studentSkill.skill_id as any)?._id || studentSkill.skill_id,
          name: (studentSkill.skill_id as any)?.name || skill.name,
          category: (studentSkill.skill_id as any)?.category || skill.category,
          proficiency: studentSkill.proficiency,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Skill Proficiency Management Endpoint: DELETE /api/students/:id/skills/:skillId
export const removeStudentSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, skillId } = req.params;

    const result = await StudentSkill.findOneAndDelete({
      student_id: id,
      skill_id: skillId,
    });

    if (!result) {
      res.status(404).json({ status: 'fail', message: 'Student skill mapping not found.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Student skill rating removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

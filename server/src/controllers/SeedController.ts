import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student.js';
import { Skill } from '../models/Skill.js';
import { StudentSkill } from '../models/StudentSkill.js';
import { Job } from '../models/Job.js';
import { JobSkill } from '../models/JobSkill.js';
import { Recommendation } from '../models/Recommendation.js';
import { Application } from '../models/Application.js';

export class SeedController {
  public static async seedDemoData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Clear collections & drop legacy indexes
      await Promise.all([
        Student.deleteMany({}),
        Skill.deleteMany({}),
        StudentSkill.deleteMany({}),
        Job.deleteMany({}),
        JobSkill.deleteMany({}),
        Recommendation.deleteMany({}),
        Application.deleteMany({}),
      ]);
      await Skill.collection.dropIndexes().catch(() => {});

      // 1. Create Skills
      const java = await Skill.create({ name: 'Java', category: 'Backend' });
      const mysql = await Skill.create({ name: 'MySQL', category: 'Database' });
      const springBoot = await Skill.create({ name: 'Spring Boot', category: 'Backend' });
      const react = await Skill.create({ name: 'React', category: 'Frontend' });
      const aws = await Skill.create({ name: 'AWS', category: 'Cloud' });
      const python = await Skill.create({ name: 'Python', category: 'Backend' });

      // 2. Create Student Arun
      const student = await Student.create({
        name: 'Arun',
        email: 'arun@example.com',
        jobTitle: 'Java Full Stack Developer',
      });

      // 3. Assign Skills to Arun
      await StudentSkill.insertMany([
        { student_id: student._id, skill_id: java._id, proficiency: 4 },
        { student_id: student._id, skill_id: mysql._id, proficiency: 4 },
        { student_id: student._id, skill_id: python._id, proficiency: 3 },
        { student_id: student._id, skill_id: react._id, proficiency: 2 },
        { student_id: student._id, skill_id: aws._id, proficiency: 1 },
        { student_id: student._id, skill_id: springBoot._id, proficiency: 2 },
      ]);

      // 4. Create Job
      const job = await Job.create({
        title: 'Java Full Stack Developer',
        company: 'ABC Technologies',
        location: 'Bangalore, India',
        description: 'Looking for an experienced Java Full Stack Developer.',
      });

      // 5. Job Skill Requirements
      await JobSkill.insertMany([
        { job_id: job._id, skill_id: java._id, required_level: 4, mandatory: true },
        { job_id: job._id, skill_id: springBoot._id, required_level: 4, mandatory: true },
        { job_id: job._id, skill_id: react._id, required_level: 3, mandatory: true },
        { job_id: job._id, skill_id: mysql._id, required_level: 3, mandatory: true },
        { job_id: job._id, skill_id: aws._id, required_level: 2, mandatory: false },
      ]);

      res.status(201).json({
        status: 'success',
        success: true,
        message: 'Demo dataset seeded successfully.',
        data: {
          studentId: String(student._id),
          jobId: String(job._id),
          studentName: student.name,
          jobTitle: job.title,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

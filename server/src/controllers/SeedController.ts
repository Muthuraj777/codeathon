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
      // Clear collections
      await Promise.all([
        Student.deleteMany({}),
        Skill.deleteMany({}),
        StudentSkill.deleteMany({}),
        Job.deleteMany({}),
        JobSkill.deleteMany({}),
        Recommendation.deleteMany({}),
        Application.deleteMany({}),
      ]);

      // 1. Create Skills
      const skillsData = [
        { skill_id: 'sk-java', name: 'Java', category: 'Backend' },
        { skill_id: 'sk-mysql', name: 'MySQL', category: 'Database' },
        { skill_id: 'sk-springboot', name: 'Spring Boot', category: 'Backend' },
        { skill_id: 'sk-react', name: 'React', category: 'Frontend' },
        { skill_id: 'sk-aws', name: 'AWS', category: 'Cloud' },
        { skill_id: 'sk-python', name: 'Python', category: 'Backend' },
        { skill_id: 'sk-docker', name: 'Docker', category: 'DevOps' },
      ];
      await Skill.insertMany(skillsData);

      // 2. Create Student Arun
      const student = await Student.create({
        student_id: '101',
        name: 'Arun',
        email: 'arun@example.com',
      });

      // 3. Create Arun's Skills (Page 4)
      const studentSkillsData = [
        { student_id: '101', skill_id: 'sk-java', proficiency: 4 },
        { student_id: '101', skill_id: 'sk-mysql', proficiency: 4 },
        { student_id: '101', skill_id: 'sk-python', proficiency: 3 },
        { student_id: '101', skill_id: 'sk-react', proficiency: 2 },
        { student_id: '101', skill_id: 'sk-aws', proficiency: 1 },
        { student_id: '101', skill_id: 'sk-springboot', proficiency: 2 },
      ];
      await StudentSkill.insertMany(studentSkillsData);

      // 4. Create Job (Page 5)
      const job = await Job.create({
        job_id: '501',
        company: 'ABC Technologies',
        title: 'Java Full Stack Developer',
        location: 'Bangalore, India',
      });

      // 5. Create Job Skills Requirements (Page 2 & 5)
      const jobSkillsData = [
        { job_id: '501', skill_id: 'sk-java', required_level: 4, mandatory: true },
        { job_id: '501', skill_id: 'sk-springboot', required_level: 4, mandatory: true },
        { job_id: '501', skill_id: 'sk-react', required_level: 3, mandatory: true },
        { job_id: '501', skill_id: 'sk-mysql', required_level: 3, mandatory: true },
        { job_id: '501', skill_id: 'sk-aws', required_level: 2, mandatory: false },
      ];
      await JobSkill.insertMany(jobSkillsData);

      res.status(201).json({
        success: true,
        message: 'Demo dataset seeded successfully according to specification.',
        data: {
          student: { id: student.student_id, name: student.name },
          job: { id: job.job_id, title: job.title, company: job.company },
          skillsCount: skillsData.length,
          jobSkillsCount: jobSkillsData.length,
          studentSkillsCount: studentSkillsData.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

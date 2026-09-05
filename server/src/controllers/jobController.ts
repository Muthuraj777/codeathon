import { Request, Response, NextFunction } from 'express';
import { Job } from '../models/Job.js';
import { JobSkill } from '../models/JobSkill.js';
import { Skill } from '../models/Skill.js';
import { createJobSchema, updateJobSchema, addOrUpdateJobSkillSchema } from '../validations/jobValidation.js';

export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createJobSchema.parse(req.body);

    const job = await Job.create(validated);

    res.status(201).json({
      status: 'success',
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query;

    const query: any = {};
    if (search && typeof search === 'string') {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ status: 'fail', message: 'Job profile not found.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validated = updateJobSchema.parse(req.body);

    const job = await Job.findByIdAndUpdate(id, validated, { new: true, runValidators: true });
    if (!job) {
      res.status(404).json({ status: 'fail', message: 'Job profile not found.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      res.status(404).json({ status: 'fail', message: 'Job profile not found.' });
      return;
    }

    // Clean up associated required skill mappings
    await JobSkill.deleteMany({ job_id: id });

    res.status(200).json({
      status: 'success',
      message: 'Job profile and associated skill requirements deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Required Skills Management Endpoint: GET /api/jobs/:id/skills
export const getJobSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ status: 'fail', message: 'Job profile not found.' });
      return;
    }

    const jobSkills = await JobSkill.find({ job_id: id }).populate('skill_id');

    res.status(200).json({
      status: 'success',
      results: jobSkills.length,
      data: {
        job,
        requiredSkills: jobSkills.map((item: any) => ({
          id: item._id,
          skillId: item.skill_id?._id || item.skill_id,
          name: item.skill_id?.name || 'Unknown',
          category: item.skill_id?.category || 'Other',
          requiredLevel: item.required_level,
          mandatory: item.mandatory,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Required Skills Management Endpoint: POST /api/jobs/:id/skills
export const addOrUpdateJobSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validated = addOrUpdateJobSkillSchema.parse(req.body);

    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ status: 'fail', message: 'Job profile not found.' });
      return;
    }

    const skill = await Skill.findById(validated.skill_id);
    if (!skill) {
      res.status(404).json({ status: 'fail', message: 'Skill not found in catalog.' });
      return;
    }

    const jobSkill = await JobSkill.findOneAndUpdate(
      { job_id: id, skill_id: validated.skill_id },
      {
        required_level: validated.required_level,
        mandatory: validated.mandatory ?? true,
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('skill_id');

    res.status(200).json({
      status: 'success',
      data: {
        jobSkill: {
          id: jobSkill._id,
          skillId: (jobSkill.skill_id as any)?._id || jobSkill.skill_id,
          name: (jobSkill.skill_id as any)?.name || skill.name,
          category: (jobSkill.skill_id as any)?.category || skill.category,
          requiredLevel: jobSkill.required_level,
          mandatory: jobSkill.mandatory,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Required Skills Management Endpoint: DELETE /api/jobs/:id/skills/:skillId
export const removeJobSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, skillId } = req.params;

    const result = await JobSkill.findOneAndDelete({
      job_id: id,
      skill_id: skillId,
    });

    if (!result) {
      res.status(404).json({ status: 'fail', message: 'Job skill requirement mapping not found.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Job skill requirement removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

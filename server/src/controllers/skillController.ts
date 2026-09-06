import { Request, Response, NextFunction } from 'express';
import { Skill } from '../models/Skill.js';
import { createSkillSchema, updateSkillSchema } from '../validations/skillValidation.js';

export const createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createSkillSchema.parse(req.body);

    const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${validated.name}$`, 'i') } });
    if (existingSkill) {
      res.status(400).json({ status: 'fail', message: `Skill '${validated.name}' already exists.` });
      return;
    }

    const skill = await Skill.create(validated);

    res.status(201).json({
      status: 'success',
      data: { skill },
    });
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search } = req.query;

    const query: any = {};

    if (category && typeof category === 'string') {
      query.category = category;
    }

    if (search && typeof search === 'string') {
      query.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(query).sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      results: skills.length,
      data: { skills },
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      res.status(404).json({ status: 'fail', message: 'Skill not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { skill },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validated = updateSkillSchema.parse(req.body);

    if (validated.name) {
      const existing = await Skill.findOne({
        name: { $regex: new RegExp(`^${validated.name}$`, 'i') },
        _id: { $ne: id },
      });
      if (existing) {
        res.status(400).json({ status: 'fail', message: `Another skill named '${validated.name}' already exists.` });
        return;
      }
    }

    const skill = await Skill.findByIdAndUpdate(id, validated, { new: true, runValidators: true });

    if (!skill) {
      res.status(404).json({ status: 'fail', message: 'Skill not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { skill },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      res.status(404).json({ status: 'fail', message: 'Skill not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dbCategories = await Skill.distinct('category');
    const defaultCategories = ['Backend', 'Frontend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'AI/ML', 'Other'];
    const combined = Array.from(new Set([...defaultCategories, ...dbCategories])).filter(Boolean).sort();

    res.status(200).json({
      status: 'success',
      data: { categories: combined },
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Application } from '../models/Application.js';
import { Student } from '../models/Student.js';
import { Job } from '../models/Job.js';
import { SkillGapService } from '../services/SkillGapService.js';
import mongoose from 'mongoose';

export const createApplicationSchema = z.object({
  student_id: z.string().optional(),
  studentId: z.string().optional(),
  job_id: z.string().optional(),
  jobId: z.string().optional(),
  studentName: z.string().optional(),
  studentEmail: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  match_percent: z.number().min(0).max(100).optional(),
  matchPercent: z.number().min(0).max(100).optional(),
}).refine((data) => data.student_id || data.studentId, {
  message: 'student_id or studentId is required',
}).refine((data) => data.job_id || data.jobId, {
  message: 'job_id or jobId is required',
});

export const updateStatusSchema = z.object({
  status: z.enum(['Submitted', 'Under Review', 'Interviewing', 'Applied', 'Accepted', 'Rejected']),
});

export class ApplicationController {
  /**
   * POST /api/applications - Submit a job application
   */
  public static async createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.body.student_id || req.body.studentId;
      const jobId = req.body.job_id || req.body.jobId;

      let studentName = req.body.studentName;
      let studentEmail = req.body.studentEmail;
      let jobTitle = req.body.jobTitle;
      let companyName = req.body.companyName;
      let matchPercent = req.body.match_percent ?? req.body.matchPercent;

      // Lookup student & job details if missing
      if (!studentName || !studentEmail) {
        if (mongoose.Types.ObjectId.isValid(studentId)) {
          const studentDoc = await Student.findById(studentId).lean();
          if (studentDoc) {
            studentName = studentName || studentDoc.name;
            studentEmail = studentEmail || studentDoc.email;
          }
        }
      }

      if (!jobTitle || !companyName) {
        if (mongoose.Types.ObjectId.isValid(jobId)) {
          const jobDoc = await Job.findById(jobId).lean();
          if (jobDoc) {
            jobTitle = jobTitle || jobDoc.title;
            companyName = companyName || jobDoc.company;
          }
        }
      }

      // Calculate skill gap match percent if missing
      if (matchPercent === undefined || matchPercent === null) {
        try {
          const gapResult = await SkillGapService.analyzeSkillGap(studentId, jobId);
          matchPercent = gapResult.overallMatchScore;
        } catch {
          matchPercent = 70; // default fallback
        }
      }

      const application = await Application.create({
        student_id: studentId,
        studentId,
        studentName: studentName || 'Candidate',
        studentEmail: studentEmail || '',
        job_id: jobId,
        jobId,
        jobTitle: jobTitle || 'Software Engineer',
        companyName: companyName || 'Company',
        match_percent: matchPercent,
        matchPercent,
        status: req.body.status || 'Submitted',
        appliedAt: new Date(),
      });

      const responsePayload = {
        id: String(application._id),
        _id: String(application._id),
        studentId,
        student_id: studentId,
        studentName: application.studentName,
        studentEmail: application.studentEmail,
        jobId,
        job_id: jobId,
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        matchPercent: application.match_percent,
        match_percent: application.match_percent,
        status: application.status,
        appliedAt: application.appliedAt,
      };

      res.status(201).json({
        status: 'success',
        success: true,
        data: responsePayload,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/applications - Get all applications (with optional filters)
   */
  public static async getApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, jobId, status } = req.query;
      const filter: any = {};

      if (studentId) {
        filter.$or = [{ student_id: studentId }, { studentId: studentId }];
      }
      if (jobId) {
        filter.$or = [{ job_id: jobId }, { jobId: jobId }];
      }
      if (status) {
        filter.status = status;
      }

      const applications = await Application.find(filter).sort({ createdAt: -1 }).lean();

      const formattedApps = applications.map((app) => ({
        id: String(app._id),
        _id: String(app._id),
        studentId: app.studentId || String(app.student_id),
        student_id: String(app.student_id),
        studentName: app.studentName || 'Candidate',
        studentEmail: app.studentEmail || '',
        jobId: app.jobId || String(app.job_id),
        job_id: String(app.job_id),
        jobTitle: app.jobTitle || 'Software Engineer',
        companyName: app.companyName || 'Company',
        matchPercent: app.match_percent,
        match_percent: app.match_percent,
        status: app.status,
        appliedAt: app.appliedAt || app.createdAt,
      }));

      res.status(200).json({
        status: 'success',
        success: true,
        data: formattedApps,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/applications/:id/status - Update application status
   */
  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      let application = await Application.findById(id);
      if (!application) {
        application = await Application.findOne({
          $or: [{ _id: id }, { student_id: id }, { jobId: id }],
        });
      }

      if (!application) {
        res.status(404).json({
          status: 'fail',
          success: false,
          message: `Application '${id}' not found`,
        });
        return;
      }

      application.status = status;
      await application.save();

      const responsePayload = {
        id: String(application._id),
        _id: String(application._id),
        studentId: application.studentId || String(application.student_id),
        student_id: String(application.student_id),
        studentName: application.studentName,
        studentEmail: application.studentEmail,
        jobId: application.jobId || String(application.job_id),
        job_id: String(application.job_id),
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        matchPercent: application.match_percent,
        match_percent: application.match_percent,
        status: application.status,
        appliedAt: application.appliedAt,
      };

      res.status(200).json({
        status: 'success',
        success: true,
        data: responsePayload,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/applications/:id - Get application by ID
   */
  public static async getApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const app = await Application.findById(id).lean();

      if (!app) {
        res.status(404).json({
          status: 'fail',
          success: false,
          message: `Application '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        success: true,
        data: {
          id: String(app._id),
          _id: String(app._id),
          studentId: app.studentId || String(app.student_id),
          student_id: String(app.student_id),
          studentName: app.studentName,
          studentEmail: app.studentEmail,
          jobId: app.jobId || String(app.job_id),
          job_id: String(app.job_id),
          jobTitle: app.jobTitle,
          companyName: app.companyName,
          matchPercent: app.match_percent,
          match_percent: app.match_percent,
          status: app.status,
          appliedAt: app.appliedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

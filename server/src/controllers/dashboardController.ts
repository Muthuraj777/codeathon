import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student.js';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Recommendation } from '../models/Recommendation.js';
import { Skill } from '../models/Skill.js';
import { JobSkill } from '../models/JobSkill.js';

export class DashboardController {
  /**
   * GET /api/dashboard/stats - Real-time Executive Dashboard & Skill Gap Analytics Aggregation
   */
  public static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Parallel Real Counts from Database
      const [studentCount, candidateUserCount, jobCount, applicationCount] = await Promise.all([
        Student.countDocuments(),
        User.countDocuments({ role: { $in: ['student', 'employee'] } }),
        Job.countDocuments(),
        Application.countDocuments(),
      ]);

      const totalEmployees = Math.max(studentCount, candidateUserCount);
      const totalJobs = jobCount;
      const totalApplications = applicationCount;

      // 2. Compute Real Average Skill Match Percent
      let averageMatchPercent = 0;
      if (totalApplications > 0) {
        const avgResult = await Application.aggregate([
          { $group: { _id: null, avgMatch: { $avg: '$match_percent' } } },
        ]);
        if (avgResult.length > 0 && avgResult[0].avgMatch != null) {
          averageMatchPercent = Math.round(avgResult[0].avgMatch);
        }
      }

      // 3. Compute Real Top Skill Gaps
      let topSkillGaps: Array<{ skillName: string; gapCount: number; percentage: number; category: string }> = [];

      const recAggregation = await Recommendation.aggregate([
        { $group: { _id: '$skill_id', gapCount: { $sum: 1 } } },
        { $sort: { gapCount: -1 } },
        { $limit: 5 },
      ]);

      if (recAggregation.length > 0) {
        const totalRecs = await Recommendation.countDocuments();
        const skillIds = recAggregation.map((r) => r._id);
        const skills = await Skill.find({
          $or: [{ skill_id: { $in: skillIds } }, { _id: { $in: skillIds } }],
        })
          .select('name category skill_id _id')
          .lean();

        const skillMap = new Map<string, { name: string; category: string }>();
        for (const sk of skills) {
          const skAny = sk as any;
          if (skAny.skill_id) skillMap.set(skAny.skill_id, { name: sk.name, category: sk.category });
          skillMap.set(String(sk._id), { name: sk.name, category: sk.category });
        }

        topSkillGaps = recAggregation.map((item) => {
          const info = skillMap.get(String(item._id)) || { name: String(item._id), category: 'General' };
          const percentage = totalRecs > 0 ? Math.round((item.gapCount / totalRecs) * 100) : 0;
          return {
            skillName: info.name,
            gapCount: item.gapCount,
            percentage,
            category: info.category,
          };
        });
      }

      // If no recommendations recorded yet, aggregate job skill benchmark requirements from DB
      if (topSkillGaps.length === 0) {
        const jobSkillAggregation = await JobSkill.aggregate([
          { $group: { _id: '$skill_id', gapCount: { $sum: 1 } } },
          { $sort: { gapCount: -1 } },
          { $limit: 5 },
        ]);

        if (jobSkillAggregation.length > 0) {
          const skillIds = jobSkillAggregation.map((r) => r._id);
          const skills = await Skill.find({
            $or: [{ skill_id: { $in: skillIds } }, { _id: { $in: skillIds } }],
          })
            .select('name category skill_id _id')
            .lean();

          const skillMap = new Map<string, { name: string; category: string }>();
          for (const sk of skills) {
            const skAny = sk as any;
            if (skAny.skill_id) skillMap.set(skAny.skill_id, { name: sk.name, category: sk.category });
            skillMap.set(String(sk._id), { name: sk.name, category: sk.category });
          }

          topSkillGaps = jobSkillAggregation.map((item) => {
            const info = skillMap.get(String(item._id)) || { name: 'Skill Benchmark', category: 'General' };
            const percentage = totalJobs > 0 ? Math.round((item.gapCount / totalJobs) * 100) : 0;
            return {
              skillName: info.name,
              gapCount: item.gapCount,
              percentage,
              category: info.category,
            };
          });
        }
      }

      // 4. Construct real-time metadata strings
      const employeesMeta = totalEmployees === 1 ? '1 candidate in system' : `${totalEmployees} candidates in system`;
      const jobsMeta = totalJobs === 1 ? '1 active job post' : `${totalJobs} active job posts`;
      const applicationsMeta = totalApplications === 1 ? '1 application submitted' : `${totalApplications} applications submitted`;
      const matchMeta = totalApplications > 0 ? `Across ${totalApplications} applications` : 'No applications yet';

      const responsePayload = {
        totalEmployees,
        totalStudents: totalEmployees,
        totalJobs,
        totalApplications,
        averageMatchPercent,
        averageSkillMatch: averageMatchPercent,
        employeesMeta,
        jobsMeta,
        applicationsMeta,
        matchMeta,
        topSkillGaps,
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
}


import { Student } from '../models/Student.js';
import { Job } from '../models/Job.js';
import { Skill } from '../models/Skill.js';
import { StudentSkill } from '../models/StudentSkill.js';
import { JobSkill } from '../models/JobSkill.js';
import { Recommendation } from '../models/Recommendation.js';

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  status: 'Matched' | 'Gap';
  mandatory: boolean;
  matchPercent: number;
}

export interface SkillGapAnalysisResult {
  student: {
    studentId: string;
    name: string;
    email: string;
  };
  job: {
    jobId: string;
    company: string;
    title: string;
    location: string;
  };
  overallMatchPercent: number;
  summary: {
    totalSkills: number;
    matchedSkills: number;
    gapSkills: number;
    mandatoryGaps: number;
    optionalGaps: number;
  };
  skills: SkillGapItem[];
}

export interface RecommendationItem {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  mandatory: boolean;
}

export interface RecommendationResult {
  student: {
    studentId: string;
    name: string;
  };
  job: {
    jobId: string;
    company: string;
    title: string;
  };
  totalRecommendations: number;
  recommendations: RecommendationItem[];
}

export class SkillGapService {
  private static MANDATORY_WEIGHT = 1.5;
  private static OPTIONAL_WEIGHT = 1.0;

  /**
   * Resolve a student by either custom student_id or MongoDB _id
   */
  public static async findStudent(studentIdentifier: string) {
    let student = await Student.findOne({ student_id: studentIdentifier });
    if (!student && studentIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(studentIdentifier);
    }
    return student;
  }

  /**
   * Resolve a job by either custom job_id or MongoDB _id
   */
  public static async findJob(jobIdentifier: string) {
    let job = await Job.findOne({ job_id: jobIdentifier });
    if (!job && jobIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      job = await Job.findById(jobIdentifier);
    }
    return job;
  }

  /**
   * Analyzes skill gaps between a student and a job
   */
  public static async analyzeSkillGap(studentId: string, jobId: string): Promise<SkillGapAnalysisResult> {
    const student = await this.findStudent(studentId);
    if (!student) {
      const error: any = new Error(`Student with ID '${studentId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const job = await this.findJob(jobId);
    if (!job) {
      const error: any = new Error(`Job with ID '${jobId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    // Fetch required skills for the job
    const jobSkills = await JobSkill.find({
      $or: [{ job_id: job.job_id }, { job_id: String(job._id) }],
    }).lean();

    // Fetch student's acquired skills
    const studentSkills = await StudentSkill.find({
      $or: [{ student_id: student.student_id }, { student_id: String(student._id) }],
    }).lean();

    // Map student skills by skill_id
    const studentSkillMap = new Map<string, number>();
    for (const s of studentSkills) {
      studentSkillMap.set(s.skill_id, s.proficiency);
    }

    // Cache skill details
    const allSkillIds = jobSkills.map((js) => js.skill_id);
    const skillEntities = await Skill.find({
      $or: [{ skill_id: { $in: allSkillIds } }, { _id: { $in: allSkillIds.filter((id) => id.match(/^[0-9a-fA-F]{24}$/)) } }],
    }).lean();

    const skillEntityMap = new Map<string, { name: string; category: string }>();
    for (const sk of skillEntities) {
      if (sk.skill_id) {
        skillEntityMap.set(sk.skill_id, { name: sk.name, category: sk.category });
      }
      skillEntityMap.set(String(sk._id), { name: sk.name, category: sk.category });
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;
    let matchedCount = 0;
    let gapCount = 0;
    let mandatoryGaps = 0;
    let optionalGaps = 0;

    const skillItems: SkillGapItem[] = [];

    for (const js of jobSkills) {
      const skillInfo = skillEntityMap.get(js.skill_id) || {
        name: js.skill_id,
        category: 'General',
      };

      const currentLevel = studentSkillMap.get(js.skill_id) || 0;
      const requiredLevel = js.required_level;
      const gap = Math.max(requiredLevel - currentLevel, 0);
      const status: 'Matched' | 'Gap' = currentLevel >= requiredLevel ? 'Matched' : 'Gap';

      if (status === 'Matched') {
        matchedCount++;
      } else {
        gapCount++;
        if (js.mandatory) {
          mandatoryGaps++;
        } else {
          optionalGaps++;
        }
      }

      // Weight calculation
      const weight = js.mandatory ? this.MANDATORY_WEIGHT : this.OPTIONAL_WEIGHT;
      const matchRatio = requiredLevel > 0 ? Math.min(currentLevel / requiredLevel, 1.0) : 1.0;
      totalWeightedScore += matchRatio * weight;
      totalWeight += weight;

      skillItems.push({
        skillId: js.skill_id,
        skillName: skillInfo.name,
        category: skillInfo.category,
        currentLevel,
        requiredLevel,
        gap,
        status,
        mandatory: js.mandatory,
        matchPercent: Math.round(matchRatio * 100),
      });
    }

    const overallMatchPercent =
      totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 100;

    return {
      student: {
        studentId: student.student_id,
        name: student.name,
        email: student.email,
      },
      job: {
        jobId: job.job_id,
        company: job.company,
        title: job.title,
        location: job.location,
      },
      overallMatchPercent,
      summary: {
        totalSkills: jobSkills.length,
        matchedSkills: matchedCount,
        gapSkills: gapCount,
        mandatoryGaps,
        optionalGaps,
      },
      skills: skillItems,
    };
  }

  /**
   * Generates prioritized recommendations for gaps
   */
  public static async getRecommendations(
    studentId: string,
    jobId: string
  ): Promise<RecommendationResult> {
    const analysis = await this.analyzeSkillGap(studentId, jobId);

    // Filter only skills with gap > 0
    const gaps = analysis.skills.filter((s) => s.gap > 0);

    const recommendationItems: RecommendationItem[] = gaps.map((g) => {
      let priority: 'High' | 'Medium' | 'Low';
      let reason: string;

      if (g.mandatory) {
        if (g.gap >= 2) {
          priority = 'High';
          reason = 'Mandatory job requirement';
        } else {
          priority = 'Medium';
          reason = 'Required proficiency gap';
        }
      } else {
        if (g.gap >= 1) {
          priority = 'Medium';
          reason = 'Required supporting skill';
        } else {
          priority = 'Low';
          reason = 'Optional skill enhancement';
        }
      }

      return {
        skillId: g.skillId,
        skillName: g.skillName,
        category: g.category,
        currentLevel: g.currentLevel,
        targetLevel: g.requiredLevel,
        gap: g.gap,
        priority,
        reason,
        mandatory: g.mandatory,
      };
    });

    // Sort order: High -> Medium -> Low, then by gap descending
    const priorityRank = { High: 3, Medium: 2, Low: 1 };
    recommendationItems.sort((a, b) => {
      const diff = priorityRank[b.priority] - priorityRank[a.priority];
      if (diff !== 0) return diff;
      return b.gap - a.gap;
    });

    // Sync / persist recommendations in MongoDB for record-keeping
    try {
      for (const item of recommendationItems) {
        await Recommendation.findOneAndUpdate(
          {
            student_id: analysis.student.studentId,
            job_id: analysis.job.jobId,
            skill_id: item.skillId,
          },
          {
            student_id: analysis.student.studentId,
            job_id: analysis.job.jobId,
            skill_id: item.skillId,
            priority: item.priority,
            reason: item.reason,
            current_level: item.currentLevel,
            target_level: item.targetLevel,
          },
          { upsert: true, returnDocument: 'after' }
        );
      }
    } catch (err) {
      console.warn('[SkillGapService] Warning persisting recommendations:', err);
    }

    return {
      student: {
        studentId: analysis.student.studentId,
        name: analysis.student.name,
      },
      job: {
        jobId: analysis.job.jobId,
        company: analysis.job.company,
        title: analysis.job.title,
      },
      totalRecommendations: recommendationItems.length,
      recommendations: recommendationItems,
    };
  }
}

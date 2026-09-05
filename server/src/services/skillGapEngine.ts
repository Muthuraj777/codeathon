import { Student } from '../models/Student.js';
import { StudentSkill } from '../models/StudentSkill.js';
import { Job } from '../models/Job.js';
import { JobSkill } from '../models/JobSkill.js';
import { Recommendation } from '../models/Recommendation.js';

export interface AnalyzedSkillItem {
  skillId: string;
  name: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  status: 'MATCHED' | 'GAP';
  mandatory: boolean;
}

export interface RecommendationItem {
  id?: string;
  skillId: string;
  skillName: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  currentLevel: number;
  targetLevel: number;
  reason: string;
}

export interface SkillGapAnalysisResult {
  student: {
    id: string;
    name: string;
    email: string;
    jobTitle: string;
  };
  job: {
    id: string;
    company: string;
    title: string;
    location: string;
  };
  overallMatchPercent: number;
  skills: AnalyzedSkillItem[];
  recommendations: RecommendationItem[];
}

export async function computeSkillGapAnalysis(studentId: string, jobId: string): Promise<SkillGapAnalysisResult> {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error('Student profile not found');
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error('Job profile not found');
  }

  // Fetch student skills and job required skills
  const studentSkills = await StudentSkill.find({ student_id: studentId }).populate('skill_id');
  const jobSkills = await JobSkill.find({ job_id: jobId }).populate('skill_id');

  // Map student skill levels by skill ID
  const studentSkillMap = new Map<string, number>();
  studentSkills.forEach((ss: any) => {
    const sId = ss.skill_id?._id?.toString() || ss.skill_id?.toString();
    if (sId) {
      studentSkillMap.set(sId, ss.proficiency);
    }
  });

  let totalWeightedScore = 0;
  let totalWeight = 0;
  const analyzedSkills: AnalyzedSkillItem[] = [];
  const generatedRecommendations: RecommendationItem[] = [];

  // Iterate over job skill requirements
  for (const js of jobSkills) {
    const skillObj: any = js.skill_id;
    if (!skillObj) continue;

    const sId = skillObj._id.toString();
    const skillName = skillObj.name || 'Unknown Skill';
    const category = skillObj.category || 'Other';
    const requiredLevel = js.required_level;
    const mandatory = js.mandatory ?? true;

    const currentLevel = studentSkillMap.get(sId) || 0;
    const gap = Math.max(requiredLevel - currentLevel, 0);
    const status: 'MATCHED' | 'GAP' = currentLevel >= requiredLevel ? 'MATCHED' : 'GAP';

    // Weight calculation: Mandatory = 1.5, Optional = 1.0
    const weight = mandatory ? 1.5 : 1.0;
    const scoreFraction = Math.min(currentLevel / requiredLevel, 1.0);

    totalWeightedScore += weight * scoreFraction;
    totalWeight += weight;

    analyzedSkills.push({
      skillId: sId,
      name: skillName,
      category,
      currentLevel,
      requiredLevel,
      gap,
      status,
      mandatory,
    });

    // Generate recommendation if gap exists
    if (gap > 0) {
      let priority: 'High' | 'Medium' | 'Low' = 'Low';
      let reason = 'Required supporting skill';

      if (mandatory) {
        priority = 'High';
        reason = 'Mandatory job requirement';
      } else if (gap >= 2) {
        priority = 'Medium';
        reason = 'Required proficiency gap';
      } else {
        priority = 'Medium';
        reason = 'Required supporting skill';
      }

      generatedRecommendations.push({
        skillId: sId,
        skillName,
        category,
        priority,
        currentLevel,
        targetLevel: requiredLevel,
        reason,
      });

      // Persist recommendation in DB
      await Recommendation.findOneAndUpdate(
        { student_id: studentId, job_id: jobId, skill_id: sId },
        {
          priority,
          reason,
          current_level: currentLevel,
          target_level: requiredLevel,
        },
        { upsert: true, new: true }
      );
    }
  }

  // Calculate Overall Weighted Match Percentage
  const overallMatchPercent = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 100;

  // Sort recommendations by priority (High -> Medium -> Low)
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  generatedRecommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    student: {
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      jobTitle: student.jobTitle,
    },
    job: {
      id: job._id.toString(),
      company: job.company,
      title: job.title,
      location: job.location,
    },
    overallMatchPercent,
    skills: analyzedSkills,
    recommendations: generatedRecommendations,
  };
}

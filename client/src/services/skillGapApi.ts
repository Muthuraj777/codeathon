import type { Student, Job, RecommendationItem, SkillGapResponse } from '../types/skillGap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const skillGapApi = {
  getStudents: async (): Promise<Student[]> => {
    const res = await fetch(`${API_BASE_URL}/students`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch students (Status: ${res.status})`);
    }
    const data = await res.json();
    if (Array.isArray(data.data?.students)) return data.data.students;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.students)) return data.students;
    if (Array.isArray(data)) return data;
    return [];
  },

  getJobs: async (): Promise<Job[]> => {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch jobs (Status: ${res.status})`);
    }
    const data = await res.json();
    if (Array.isArray(data.data?.jobs)) return data.data.jobs;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.jobs)) return data.jobs;
    if (Array.isArray(data)) return data;
    return [];
  },

  getSkillGap: async (studentId: string, jobId: string): Promise<SkillGapResponse['data']> => {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/jobs/${jobId}/skill-gap`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `Failed to calculate skill gap (Status: ${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  getRecommendations: async (studentId: string, jobId: string): Promise<RecommendationItem[]> => {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/jobs/${jobId}/recommendations`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `Failed to fetch recommendations (Status: ${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },
};


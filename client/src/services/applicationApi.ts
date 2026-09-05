import type { Application, ApplicationStatus } from '../types/application';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1001',
    studentId: 'student-101',
    studentName: 'Arun',
    studentEmail: 'arun@example.com',
    jobId: 'job-501',
    jobTitle: 'Java Full Stack Developer',
    companyName: 'ABC Technologies',
    matchPercent: 72,
    status: 'Under Review',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-1002',
    studentId: 'student-102',
    studentName: 'Priya Sharma',
    studentEmail: 'priya@example.com',
    jobId: 'job-501',
    jobTitle: 'Java Full Stack Developer',
    companyName: 'ABC Technologies',
    matchPercent: 88,
    status: 'Interviewing',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-1003',
    studentId: 'student-101',
    studentName: 'Arun',
    studentEmail: 'arun@example.com',
    jobId: 'job-502',
    jobTitle: 'Cloud Architect',
    companyName: 'CloudScale Inc',
    matchPercent: 45,
    status: 'Submitted',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const applicationApi = {
  getApplications: async (): Promise<Application[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data || data;
    } catch {
      return MOCK_APPLICATIONS;
    }
  },

  submitApplication: async (payload: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    matchPercent: number;
  }): Promise<Application> => {
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data || data;
    } catch {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        ...payload,
        status: 'Submitted',
        appliedAt: new Date().toISOString(),
      };
      MOCK_APPLICATIONS.unshift(newApp);
      return newApp;
    }
  },

  updateStatus: async (applicationId: string, status: ApplicationStatus): Promise<Application> => {
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data || data;
    } catch {
      const app = MOCK_APPLICATIONS.find((a) => a.id === applicationId);
      if (app) app.status = status;
      return app || MOCK_APPLICATIONS[0];
    }
  },
};

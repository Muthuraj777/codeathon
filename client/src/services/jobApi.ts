const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.message || data?.errors?.join(', ') || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export const jobApi = {
  getJobs: async (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any>(`/jobs${query}`);
  },

  getJobById: async (id: string) => {
    return request<any>(`/jobs/${id}`);
  },

  createJob: async (data: { company: string; title: string; location?: string; description?: string }) => {
    return request<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateJob: async (id: string, data: { company?: string; title?: string; location?: string; description?: string }) => {
    return request<any>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteJob: async (id: string) => {
    return request<any>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  getJobSkills: async (id: string) => {
    return request<any>(`/jobs/${id}/skills`);
  },

  addOrUpdateJobSkill: async (
    jobId: string,
    payload: { skill_id: string; required_level: number; mandatory?: boolean }
  ) => {
    return request<any>(`/jobs/${jobId}/skills`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  removeJobSkill: async (jobId: string, skillId: string) => {
    return request<any>(`/jobs/${jobId}/skills/${skillId}`, {
      method: 'DELETE',
    });
  },
};

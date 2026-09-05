import type { SkillResponse } from '../types/skill';

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

export const skillApi = {
  getSkills: async (search?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<SkillResponse>(`/skills${queryString}`);
  },

  getCategories: async () => {
    return request<SkillResponse>('/skills/categories');
  },

  createSkill: async (skillData: { name: string; category: string; description?: string }) => {
    return request<SkillResponse>('/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  },

  updateSkill: async (id: string, skillData: { name?: string; category?: string; description?: string }) => {
    return request<SkillResponse>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skillData),
    });
  },

  deleteSkill: async (id: string) => {
    return request<{ status: string; message: string }>(`/skills/${id}`, {
      method: 'DELETE',
    });
  },
};

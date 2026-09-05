const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
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

export const studentApi = {
  getStudents: async (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any>(`/students${query}`);
  },

  getStudentById: async (id: string) => {
    return request<any>(`/students/${id}`);
  },

  createStudent: async (data: { name: string; email: string; jobTitle?: string }) => {
    return request<any>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStudent: async (id: string, data: { name?: string; email?: string; jobTitle?: string }) => {
    return request<any>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStudentSkills: async (id: string) => {
    return request<any>(`/students/${id}/skills`);
  },

  addOrUpdateStudentSkill: async (studentId: string, payload: { skill_id: string; proficiency: number }) => {
    return request<any>(`/students/${studentId}/skills`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  removeStudentSkill: async (studentId: string, skillId: string) => {
    return request<any>(`/students/${studentId}/skills/${skillId}`, {
      method: 'DELETE',
    });
  },
};

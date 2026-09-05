import { create } from 'zustand';
import { studentApi } from '../services/studentApi';

export interface StudentSkillItem {
  id: string;
  skillId: string;
  name: string;
  category: string;
  proficiency: number;
}

interface StudentState {
  currentStudent: any | null;
  studentSkills: StudentSkillItem[];
  studentsList: any[];
  isLoading: boolean;
  error: string | null;

  fetchStudents: (search?: string) => Promise<void>;
  fetchStudentProfile: (studentId?: string) => Promise<void>;
  fetchStudentSkills: (studentId: string) => Promise<void>;
  updateProficiency: (studentId: string, skillId: string, proficiency: number) => Promise<void>;
  removeSkill: (studentId: string, skillId: string) => Promise<void>;
  clearError: () => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  currentStudent: null,
  studentSkills: [],
  studentsList: [],
  isLoading: false,
  error: null,

  fetchStudents: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const res = await studentApi.getStudents(search);
      set({ studentsList: res.data?.students || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchStudentProfile: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      let student = null;
      if (studentId) {
        const res = await studentApi.getStudentById(studentId);
        student = res.data?.student;
      } else {
        // Fetch first student or create default profile if none exists
        const res = await studentApi.getStudents();
        const students = res.data?.students || [];
        if (students.length > 0) {
          student = students[0];
        }
      }
      set({ currentStudent: student, isLoading: false });
      if (student) {
        await get().fetchStudentSkills(student._id || student.id);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchStudentSkills: async (studentId) => {
    try {
      const res = await studentApi.getStudentSkills(studentId);
      set({
        currentStudent: res.data?.student || get().currentStudent,
        studentSkills: res.data?.skills || [],
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateProficiency: async (studentId, skillId, proficiency) => {
    set({ isLoading: true, error: null });
    try {
      await studentApi.addOrUpdateStudentSkill(studentId, { skill_id: skillId, proficiency });
      await get().fetchStudentSkills(studentId);
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  removeSkill: async (studentId, skillId) => {
    set({ isLoading: true, error: null });
    try {
      await studentApi.removeStudentSkill(studentId, skillId);
      await get().fetchStudentSkills(studentId);
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

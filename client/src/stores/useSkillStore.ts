import { create } from 'zustand';
import type { Skill, SkillCategory } from '../types/skill';
import { skillApi } from '../services/skillApi';

interface SkillState {
  skills: Skill[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  fetchSkills: (search?: string, category?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createSkill: (skillData: { name: string; category: SkillCategory; description?: string }) => Promise<void>;
  updateSkill: (id: string, skillData: { name?: string; category?: SkillCategory; description?: string }) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  skills: [],
  categories: ['All'],
  selectedCategory: 'All',
  searchQuery: '',
  isLoading: false,
  error: null,

  fetchSkills: async (search, category) => {
    const s = search !== undefined ? search : get().searchQuery;
    const c = category !== undefined ? category : get().selectedCategory;
    set({ isLoading: true, error: null });
    try {
      const res = await skillApi.getSkills(s, c);
      set({ skills: res.data.skills || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await skillApi.getCategories();
      const catList = res.data.categories || [];
      set({ categories: ['All', ...catList] });
    } catch (e) {
      // Keep default
    }
  },

  createSkill: async (skillData) => {
    set({ isLoading: true, error: null });
    try {
      await skillApi.createSkill(skillData);
      await get().fetchSkills();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateSkill: async (id, skillData) => {
    set({ isLoading: true, error: null });
    try {
      await skillApi.updateSkill(id, skillData);
      await get().fetchSkills();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteSkill: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await skillApi.deleteSkill(id);
      await get().fetchSkills();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().fetchSkills(get().searchQuery, category);
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchSkills(query, get().selectedCategory);
  },

  clearError: () => set({ error: null }),
}));

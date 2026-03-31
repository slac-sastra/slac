import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/lib/translations';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  adminPassword: string | null;
  setAdminPassword: (pwd: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ta',
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'ta' : 'en' })),
      adminPassword: null,
      setAdminPassword: (pwd) => set({ adminPassword: pwd }),
    }),
    {
      name: 'sastra-legal-storage',
    }
  )
);

import { create } from 'zustand';

export interface Case {
  id: string;
  name: string;
  description: string;
  platform: string;
  image: string;
  site: string;
}

interface CasesState {
  cases: Case[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useCasesStore = create<CasesState>((set, get) => ({
  cases: [],
  loading: false,
  error: null,

  fetch: async () => {
    if (get().cases.length > 0) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json() as Case[];
      set({ cases: data });
    } catch {
      set({ error: 'Could not load cases.' });
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from 'zustand';

/** A package as published on pub.dev — nothing about it is stored in this repo. */
export interface DevPackage {
  name: string;
  sdk: 'flutter' | 'dart';
  repo: string | null;
  /** pub.dev summary, used when the package has no curated translation yet. */
  description: string;
  version: string;
  likes: number;
  points: number;
  maxPoints: number;
  downloads30d: number;
}

interface PackagesState {
  packages: DevPackage[];
  loading: boolean;
  /** i18n key, so the UI can render it in the current language. */
  error: string | null;
  fetch: () => Promise<void>;
}

export const usePackagesStore = create<PackagesState>((set, get) => ({
  packages: [],
  loading: false,
  error: null,

  fetch: async () => {
    if (get().packages.length > 0) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json() as DevPackage[];
      set({ packages: data });
    } catch {
      set({ error: 'packages.loadError' });
    } finally {
      set({ loading: false });
    }
  },
}));

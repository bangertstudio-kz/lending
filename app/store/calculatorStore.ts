import { create } from 'zustand';
import { getCurrentLanguage } from '@/app/i18n';
import { GOALS, trackGoal } from '@/app/analytics';
import { computeEstimates, type CustomFeatureData } from '@/app/data/estimates';

interface CalculatorState {
  description: string;
  stage: string;
  features: string[];
  customFeatureData: Record<string, CustomFeatureData>;
  estimates: ReturnType<typeof computeEstimates>;
  isAnalyzing: boolean;
  analyzeError: string | null;

  setDescription: (desc: string) => void;
  setStage: (stage: string) => void;
  toggleFeature: (key: string) => void;
  addCustomFeature: (key: string) => void;
  analyzeDescription: (files?: File[]) => Promise<void>;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  description: '',
  stage: 'mvp',
  features: [],
  customFeatureData: {},
  estimates: computeEstimates([], 'mvp'),
  isAnalyzing: false,
  analyzeError: null,

  setDescription: (description) => set({ description }),

  setStage: (stage) => {
    const { features, customFeatureData } = get();
    set({ stage, estimates: computeEstimates(features, stage, customFeatureData) });
  },

  toggleFeature: (key) => {
    const { features, stage, customFeatureData } = get();
    const newFeatures = features.includes(key)
      ? features.filter((f) => f !== key)
      : [...features, key];
    set({ features: newFeatures, estimates: computeEstimates(newFeatures, stage, customFeatureData) });
  },

  addCustomFeature: (key) => {
    const { features, stage, customFeatureData } = get();
    if (features.includes(key)) return;
    const newFeatures = [...features, key];
    set({ features: newFeatures, estimates: computeEstimates(newFeatures, stage, customFeatureData) });
  },

  analyzeDescription: async (files?: File[]) => {
    const { description } = get();
    if (!description.trim()) return;

    set({ isAnalyzing: true, analyzeError: null });
    try {
      const form = new FormData();
      form.append('description', description);
      form.append('locale', getCurrentLanguage());
      (files ?? []).forEach(f => form.append('files', f));

      const res = await fetch('/api/calculator/recommend', {
        method: 'POST',
        body: form,
      });
      const data = await res.json() as {
        features?: string[];
        customFeatures?: { key: string; cost: number; hours: number }[];
        stage?: string;
        error?: string;
      };

      if (!res.ok) {
        set({ analyzeError: 'error' });
        trackGoal(GOALS.calculatorAnalyzeError, { reason: 'response', status: res.status });
        return;
      }
      const { features = [], customFeatures = [], stage = 'mvp' } = data;
      const customFeatureData = Object.fromEntries(
        customFeatures.map(({ key, cost, hours }) => [key, { cost, hours }])
      );
      const allFeatures = [...features, ...customFeatures.map((f) => f.key)];
      const estimates = computeEstimates(allFeatures, stage, customFeatureData);
      set({ features: allFeatures, customFeatureData, stage, estimates });
      trackGoal(GOALS.calculatorAnalyzeSuccess, {
        stage,
        features: allFeatures.length,
        minCost: estimates.minCost,
        maxCost: estimates.maxCost,
      });
    } catch {
      set({ analyzeError: 'error' });
      trackGoal(GOALS.calculatorAnalyzeError, { reason: 'network' });
    } finally {
      set({ isAnalyzing: false });
    }
  },
}));

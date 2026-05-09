import { create } from 'zustand';
import calculatorData from '@/app/data/calculator.json';
import i18n from '@/app/i18n';

const HOURS_PER_WEEK = 40;
const FALLBACK_STAGE_MULTIPLIER = 1.0;
const COST_RANGE_MIN = 0.85;
const COST_RANGE_MAX = 1.2;
const WEEKS_RANGE_MIN = 0.85;
const WEEKS_RANGE_MAX = 1.25;
const MIN_WEEKS = 2;

type CustomFeatureData = { cost: number; hours: number };

const computeEstimates = (
  features: string[],
  stage: string,
  customFeatureData: Record<string, CustomFeatureData> = {}
) => {
  const stageMultiplier =
    calculatorData.stages.find((s) => s.id === stage)?.multiplier ?? FALLBACK_STAGE_MULTIPLIER;

  let totalCost = 0;
  let baseWeeks = 0;

  for (const key of features) {
    const f = calculatorData.features.find((f) => f.key === key) ?? customFeatureData[key];
    if (!f) continue;
    totalCost += f.cost * stageMultiplier;
    baseWeeks += (f.hours * stageMultiplier) / HOURS_PER_WEEK;
  }

  return {
    minCost: Math.round(totalCost * COST_RANGE_MIN),
    maxCost: Math.round(totalCost * COST_RANGE_MAX),
    minWeeks: Math.max(1, Math.floor(baseWeeks * WEEKS_RANGE_MIN)),
    maxWeeks: Math.max(MIN_WEEKS, Math.ceil(baseWeeks * WEEKS_RANGE_MAX)),
  };
};

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
      form.append('locale', i18n.language);
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

      console.log(data);
      if (!res.ok) {
        set({ analyzeError: 'error' });
        return;
      }
      const { features = [], customFeatures = [], stage = 'mvp' } = data;
      const customFeatureData = Object.fromEntries(
        customFeatures.map(({ key, cost, hours }) => [key, { cost, hours }])
      );
      const allFeatures = [...features, ...customFeatures.map((f) => f.key)];
      set({ features: allFeatures, customFeatureData, stage, estimates: computeEstimates(allFeatures, stage, customFeatureData) });
    } catch {
      set({ analyzeError: 'error' });
    } finally {
      set({ isAnalyzing: false });
    }
  },
}));

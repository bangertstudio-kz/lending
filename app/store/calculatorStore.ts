import { create } from 'zustand';
import calculatorData from '@/app/data/calculator.json';

const HOURS_PER_WEEK = 40;
const FALLBACK_STAGE_MULTIPLIER = 1.0;
const COST_RANGE_MIN = 0.85;
const COST_RANGE_MAX = 1.2;
const WEEKS_RANGE_MIN = 0.85;
const WEEKS_RANGE_MAX = 1.25;
const MIN_WEEKS = 2;

const computeEstimates = (features: string[], stage: string) => {
  const stageMultiplier =
    calculatorData.stages.find((s) => s.id === stage)?.multiplier ?? FALLBACK_STAGE_MULTIPLIER;

  let totalCost = 0;
  let baseWeeks = 0;

  for (const key of features) {
    const f = calculatorData.features.find((f) => f.key === key);
    if (!f) continue;
    totalCost += f.cost * stageMultiplier;
    baseWeeks = Math.max(baseWeeks, (f.hours * stageMultiplier) / HOURS_PER_WEEK);
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
  estimates: ReturnType<typeof computeEstimates>;
  isAnalyzing: boolean;
  analyzeError: string | null;

  setDescription: (desc: string) => void;
  setStage: (stage: string) => void;
  toggleFeature: (key: string) => void;
  addCustomFeature: (key: string) => void;
  analyzeDescription: () => Promise<void>;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  description: '',
  stage: 'mvp',
  features: [],
  estimates: computeEstimates([], 'mvp'),
  isAnalyzing: false,
  analyzeError: null,

  setDescription: (description) => set({ description }),

  setStage: (stage) => {
    const { features } = get();
    set({ stage, estimates: computeEstimates(features, stage) });
  },

  toggleFeature: (key) => {
    const { features, stage } = get();
    const newFeatures = features.includes(key)
      ? features.filter((f) => f !== key)
      : [...features, key];
    set({ features: newFeatures, estimates: computeEstimates(newFeatures, stage) });
  },

  addCustomFeature: (key) => {
    const { features, stage } = get();
    if (features.includes(key)) return;
    const newFeatures = [...features, key];
    set({ features: newFeatures, estimates: computeEstimates(newFeatures, stage) });
  },

  analyzeDescription: async () => {
    const { description } = get();
    if (!description.trim()) return;

    set({ isAnalyzing: true, analyzeError: null });
    try {
      const res = await fetch('/api/calculator/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json() as { features?: string[]; stage?: string; error?: string };
      if (!res.ok) {
        set({ analyzeError: 'error' });
        return;
      }
      const { features, stage } = data as { features: string[]; stage: string };
      set({ features, stage, estimates: computeEstimates(features, stage) });
    } catch {
      set({ analyzeError: 'error' });
    } finally {
      set({ isAnalyzing: false });
    }
  },
}));

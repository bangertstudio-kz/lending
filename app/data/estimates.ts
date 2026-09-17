import calculatorData from '@/app/data/calculator.json';

const HOURS_PER_WEEK = 40;
const FALLBACK_STAGE_MULTIPLIER = 1.0;
const COST_RANGE_MIN = 0.85;
const COST_RANGE_MAX = 1.2;
const WEEKS_RANGE_MIN = 0.85;
const WEEKS_RANGE_MAX = 1.25;
const MIN_WEEKS = 2;

export type CustomFeatureData = { cost: number; hours: number };

export const computeEstimates = (
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

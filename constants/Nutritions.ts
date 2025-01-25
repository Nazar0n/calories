export type NutritionSummary = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type IntakeNutrition = NutritionSummary & { grams: number };

export const initialNutritionSummary: NutritionSummary = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

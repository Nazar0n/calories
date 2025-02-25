export type NutritionSummary = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};

export type IntakeNutrition = NutritionSummary & { grams: number };

export const initialNutritionSummary: NutritionSummary = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

export enum Language {
  en = "en",
  ua = "ua",
}

export type NutritionGoals = {
  maxCalories: number;
  maxProteins: number;
  maxFats: number;
  maxCarbs: number;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  height: number;
  weight: number;
  dayOfBirth: Date;
  email: string;
  language: Language;
  nutritionGoals: NutritionGoals;
  createdAt: Date;
};

export const DEFAULT_NUTRITION_GOALS: NutritionGoals = {
  maxCalories: 2000,
  maxProteins: 150,
  maxFats: 70,
  maxCarbs: 250,
};

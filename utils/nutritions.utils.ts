import { IntakeNutrition } from "@/constants/Nutritions";

const calculateNutrition = (nutrition: number, grams: number) => {
  return (nutrition * grams) / 100;
};

export const calculateIntakeNutritions = (intakeNutrition: IntakeNutrition) => {
  const { calories, protein, fat, carbs, grams } = intakeNutrition;

  return {
    calories: calculateNutrition(calories, grams),
    protein: calculateNutrition(protein, grams),
    fat: calculateNutrition(fat, grams),
    carbs: calculateNutrition(carbs, grams),
  };
};

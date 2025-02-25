import { IntakeNutrition } from "@/constants/Nutritions";

const calculateNutrition = (nutrition: number, grams: number) => {
  return (nutrition * grams) / 100;
};

export const calculateIntakeNutritions = (intakeNutrition: IntakeNutrition) => {
  const { calories, proteins, fats, carbs, grams } = intakeNutrition;

  return {
    calories: calculateNutrition(calories, grams),
    proteins: calculateNutrition(proteins, grams),
    fats: calculateNutrition(fats, grams),
    carbs: calculateNutrition(carbs, grams),
  };
};

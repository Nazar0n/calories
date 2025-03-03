export type Nutritions = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};


export type IntakeNutrition = Nutritions & { grams: number };

export type Intake = {
  id: string;
  userId: string;
  productId: string | null;
  productName: string;
  nutrition: IntakeNutrition;
  createdAt: Date;
};

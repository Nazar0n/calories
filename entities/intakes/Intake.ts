export type Intake = {
  id: string;
  dayId: string;
  userId: string;
  productId: string | null;
  productName: string;
  grams: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  createdAt: Date;
};

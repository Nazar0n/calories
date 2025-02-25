import { IntakeNutrition, Nutritions } from "@/entities/intakes/Intake";
import React from "react";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const initialIntakeNutrition: IntakeNutrition = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
  grams: 0,
};

type IntakeFormProps = {
  style?: any;
  onSubmit: (intakeNutrition: IntakeNutrition) => void;
};

export default function NutritionForm({ style, onSubmit }: IntakeFormProps) {
  const [productNutrition, setProductNutrition] = useState<IntakeNutrition>(
    initialIntakeNutrition
  );
  const nutritionKeys = Object.keys(initialIntakeNutrition) as Array<
    keyof Nutritions
  >;

  return (
    <View style={style}>
      {nutritionKeys.map((nutrition) => (
        <TextInput
          key={nutrition}
          value={String(productNutrition[nutrition])}
          label={`${nutrition} per 100g`}
          onChangeText={(value) =>
            setProductNutrition((prev) => ({
              ...prev,
              [nutrition]: Number(value) || 0,
            }))
          }
          style={{ marginBottom: 8, width: 150 }}
          keyboardType="number-pad"
        />
      ))}
      <Button mode="contained" onPress={() => onSubmit(productNutrition)}>
        Add
      </Button>
    </View>
  );
}

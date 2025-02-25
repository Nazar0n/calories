import React from "react";
import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
  initialNutritionSummary,
  IntakeNutrition,
  NutritionSummary,
} from "@/constants/Nutritions";

const initialIntakeNutrition: IntakeNutrition = {
  ...initialNutritionSummary,
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
    keyof NutritionSummary
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

// const styles = StyleSheet.create({
//   container: {
//     display: "flex",
//     alignItems: "center",
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
// });

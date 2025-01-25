import React from "react";
import {
  initialNutritionSummary,
  IntakeNutrition,
  NutritionSummary,
} from "@/constants/Nutritions";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import TextInputs from "./TextInputs";
import Input from "./Input";
import NumberInput from "./NumberInput";

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
  const [value, setValue] = useState();
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
          style={{ marginBottom: 8 }}
          keyboardType="number-pad"
        />
      ))}
      <Button mode="contained" onPress={() => onSubmit(productNutrition)}>
        Add
      </Button>
      <TextInputs />
      <Input value={value} setValue={setValue} />
      <NumberInput />
    </View>
  );
}

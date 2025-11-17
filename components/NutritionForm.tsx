import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  TextInput,
} from 'react-native-paper';
import {
  IntakeNutrition,
  Nutritions,
} from '@/entities/intakes/Intake';
import { calculateIntakeNutritions } from '@/utils/nutritions.utils';

enum NutritionKeys {
  calories = "калорій",
  proteins = "білків",
  fats = "жирів",
  carbs = "вуглеводів",
  grams = "грамів",
}

const initialIntakeNutrition: IntakeNutrition = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
  grams: 0,
};

type FormData = {
  productName: string;
  nutrition: IntakeNutrition;
};

type IntakeFormProps = {
  style?: any;
  onSubmit: (data: FormData) => void;
};

export default function NutritionForm({ style, onSubmit }: IntakeFormProps) {
  const [productName, setProductName] = useState("");
  const [productNutrition, setProductNutrition] = useState<IntakeNutrition>(
    initialIntakeNutrition
  );
  const nutritionKeys = Object.keys(initialIntakeNutrition) as Array<
    keyof Nutritions
  >;

  const handleSubmit = () => {
    const nutrition = calculateIntakeNutritions(productNutrition);
    onSubmit({
      productName:
        productName.trim() || `Food (${productNutrition.calories} kcal)`,
      nutrition,
    });
    // Reset form
    setProductName("");
    setProductNutrition(initialIntakeNutrition);
  };

  return (
    <View style={style}>
      <TextInput
        value={productName}
        onChangeText={setProductName}
        label="Назва продукту (необов'язково)"
        style={{ marginBottom: 16 }}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {nutritionKeys.map((nutrition) => (
          <TextInput
            key={nutrition}
            value={String(productNutrition[nutrition])}
            label={`${NutritionKeys[nutrition]} на 100г`}
            onChangeText={(value) =>
              setProductNutrition((prev) => ({
                ...prev,
                [nutrition]: Number(value) || 0,
              }))
            }
            style={{ width: "48%" }}
            keyboardType="number-pad"
          />
        ))}
      </View>
      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 16 }}>
        Додати
      </Button>
    </View>
  );
}

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { IntakeNutrition } from '@/entities/intakes/Intake';
import { Product } from '@/entities/products/Product';
import NutritionForm from './NutritionForm';
import SelectProduct from './SelectProduct';

type AddFoodControlsProps = {
  onAddIntake: (formData: {
    productName: string;
    nutrition: IntakeNutrition;
  }) => void;
};

export default function AddFoodControls({ onAddIntake }: AddFoodControlsProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSelectProductVisible, setIsSelectProductVisible] = useState(false);

  const handleProductSelect = (product: Product, grams: number) => {
    const nutrition = {
      grams,
      calories: (product.nutrition.calories * grams) / 100,
      proteins: (product.nutrition.proteins * grams) / 100,
      fats: (product.nutrition.fats * grams) / 100,
      carbs: (product.nutrition.carbs * grams) / 100,
    };
    onAddIntake({
      productName: product.name,
      nutrition,
    });
    setIsSelectProductVisible(false);
  };

  return (
    <>
      <Button
        mode="contained"
        onPress={() => setIsFormVisible(!isFormVisible)}
        style={{ marginVertical: 16 }}
      >
        {isFormVisible ? "Закрити" : "Додати прийом їжі"}
      </Button>

      {isFormVisible && (
        <View style={styles.formButtons}>
          <Button
            mode="outlined"
            onPress={() => setIsSelectProductVisible(true)}
            style={styles.formButton}
          >
            Вибрати продукт
          </Button>
        </View>
      )}

      <SelectProduct
        visible={isSelectProductVisible}
        onSelect={handleProductSelect}
        onCancel={() => setIsSelectProductVisible(false)}
      />

      {isFormVisible && (
        <NutritionForm style={{ width: "100%" }} onSubmit={onAddIntake} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  formButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    width: "100%",
  },
  formButton: {
    flex: 1,
  },
});

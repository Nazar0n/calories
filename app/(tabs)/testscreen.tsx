import NutritionForm from "@/components/NutritionForm";
import { IntakeNutrition, NutritionSummary } from "@/constants/Nutritions";
import { calculateIntakeNutritions } from "@/utils/nutritions.utils";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Drawer, Text, TextInput } from "react-native-paper";

export const initialNutritionSummary: NutritionSummary = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

export default function TestScreen() {
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary>(
    initialNutritionSummary
  );

  const handleAddIntake = (productNutrition: IntakeNutrition) => {
    const calculatedNutritions = calculateIntakeNutritions(productNutrition);
    setNutritionSummary({
      calories: nutritionSummary.calories + calculatedNutritions.calories,
      protein: nutritionSummary.protein + calculatedNutritions.protein,
      fat: nutritionSummary.fat + calculatedNutritions.fat,
      carbs: nutritionSummary.carbs + calculatedNutritions.carbs,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text
          style={{ color: "#000", textAlign: "center", marginTop: 24 }}
          variant="displayLarge"
        >
          Summary nutrition
        </Text>
        <View>
          <Text variant="headlineMedium">
            Calories: {nutritionSummary.calories}
          </Text>
          <Text variant="headlineMedium">
            Protein: {nutritionSummary.protein}
          </Text>
          <Text variant="headlineMedium">Fat: {nutritionSummary.fat}</Text>
          <Text variant="headlineMedium">Carbs: {nutritionSummary.carbs}</Text>
        </View>
        <NutritionForm style={{ width: "100%" }} onSubmit={handleAddIntake} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    width: "100%",
    // flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    alignItems: "center",
  },
});

import CircularProgress from "@/components/CircularProgress";
import NutritionDiagrams from "@/components/NutritionDiagrams";
import NutritionForm from "@/components/NutritionForm";
import { IntakeNutrition, Nutritions } from "@/entities/intakes/Intake";
import { calculateIntakeNutritions } from "@/utils/nutritions.utils";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const initialNutritionSummary: Nutritions = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

export default function TestScreen() {
  const [nutritionSummary, setNutritionSummary] = useState<Nutritions>(
    initialNutritionSummary
  );

  const handleAddIntake = (productNutrition: IntakeNutrition) => {
    const calculatedNutritions = calculateIntakeNutritions(productNutrition);
    setNutritionSummary({
      calories: nutritionSummary.calories + calculatedNutritions.calories,
      proteins: nutritionSummary.proteins + calculatedNutritions.proteins,
      fats: nutritionSummary.fats + calculatedNutritions.fats,
      carbs: nutritionSummary.carbs + calculatedNutritions.carbs,
    });
  };

  const maxCalories = 1500;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text
          style={{ color: "#000", textAlign: "center", marginTop: 24 }}
          variant="displayLarge"
        >
          Total
        </Text>
        <View>
          <CircularProgress
            value={nutritionSummary.calories}
            maxValue={maxCalories}
          />
        </View>
        <View style={styles.nutritionDiagrams}>
          <NutritionDiagrams
            proteins={nutritionSummary.proteins}
            fats={nutritionSummary.fats}
            carbs={nutritionSummary.carbs}
          />
        </View>
        <NutritionForm style={{ width: "100%" }} onSubmit={handleAddIntake} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 8,
    backgroundColor: "#fff",
    color: "#000",
    alignItems: "center", // Додає центрування всього контенту
  },
  nutritionDiagrams: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center", // Центрує NutritionDiagrams
  },
});

import CircularProgress from "@/components/CircularProgress";
import NutritionDiagrams from "@/components/NutritionDiagrams";
import NutritionForm from "@/components/NutritionForm";
import { DayData } from "@/entities/days/Day";
import { createDay } from "@/entities/days/dayGateways";
import { Intake, IntakeNutrition, Nutritions } from "@/entities/intakes/Intake";
// import { addIntake } from "@/entities/intakes/intakeGateways";
import { calculateIntakeNutritions } from "@/utils/nutritions.utils";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

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

  const userId = getAuth().currentUser?.uid || "12345test";

  const handleAddIntake = (productNutrition: IntakeNutrition) => {
    const intake = {
      userId,
      productId: null,
      productName: "Test product",
      nutrition: productNutrition,
    };
    // addIntake(userId, intake);
    const calculatedNutritions = calculateIntakeNutritions(productNutrition);
    setNutritionSummary({
      calories: nutritionSummary.calories + calculatedNutritions.calories,
      proteins: nutritionSummary.proteins + calculatedNutritions.proteins,
      fats: nutritionSummary.fats + calculatedNutritions.fats,
      carbs: nutritionSummary.carbs + calculatedNutritions.carbs,
    });
  };

  const maxCalories = 1500;

  const handleCreateDay = () => {
    console.log("Day created");
    const dayData: DayData = {
      date: new Date(),
      createdAt: new Date(),
      intakes: [],
      userId,
    };
    createDay(dayData);
  };

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
        <Button onPress={handleCreateDay}>Create day</Button>
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

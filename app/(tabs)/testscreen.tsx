import CircularProgress from "@/components/CircularProgress";
import NutritionDiagrams from "@/components/NutritionDiagrams";
import NutritionForm from "@/components/NutritionForm";
import { Day } from "@/entities/days/Day";
import { fetchToday } from "@/entities/days/dayGateways";
import { IntakeNutrition, Nutritions } from "@/entities/intakes/Intake";
import { addIntake } from "@/entities/intakes/intakeGateways";
import { calculateIntakeNutritions } from "@/utils/nutritions.utils";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const initialNutritionSummary: Nutritions = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

export default function TestScreen() {
  const [day, setDay] = useState<Day | null>(null);

  const userId = getAuth().currentUser?.uid || "12345test";

  const nutritionSummary =
    day?.intakes.reduce((acc, intake) => {
      const calculatedNutritions = calculateIntakeNutritions(intake.nutrition);
      return {
        calories: acc.calories + calculatedNutritions.calories,
        proteins: acc.proteins + calculatedNutritions.proteins,
        fats: acc.fats + calculatedNutritions.fats,
        carbs: acc.carbs + calculatedNutritions.carbs,
      };
    }, initialNutritionSummary) || initialNutritionSummary;

  const handleAddIntake = async (productNutrition: IntakeNutrition) => {
    const intake = {
      userId,
      productId: null,
      productName: "Test product",
      nutrition: productNutrition,
      createdAt: new Date(),
    };
    await addIntake(userId, intake);
    fetchToday(userId).then((day) => setDay(day));
  };

  const maxCalories = 1500;

  useEffect(() => {
    fetchToday(userId).then((day) => setDay(day));
  }, [userId]);

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

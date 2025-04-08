import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Nutritions } from "@/entities/intakes/Intake";
import React from "react";
import CircularProgress from "./CircularProgress";
import NutritionDiagrams from "./NutritionDiagrams";

type NutritionSummaryProps = {
  nutritionSummary: Nutritions;
  maxCalories: number;
};

export default function NutritionSummary({
  nutritionSummary,
  maxCalories,
}: NutritionSummaryProps) {
  return (
    <>
      <View style={styles.header}>
        <Text variant="headlineLarge">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            weekday: "short",
            year: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.circularProgress}>
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
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  nutritionDiagrams: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  circularProgress: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

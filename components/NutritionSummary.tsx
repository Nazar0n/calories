import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Nutritions } from '@/entities/intakes/Intake';
import { NutritionGoals } from '@/entities/users/User';
import CircularProgress from './CircularProgress';
import NutritionDiagrams from './NutritionDiagrams';

type NutritionSummaryProps = {
  nutritionSummary: Nutritions;
  nutritionGoals: NutritionGoals;
};

export default function NutritionSummary({
  nutritionSummary,
  nutritionGoals,
}: NutritionSummaryProps) {
  return (
    <>
      <View style={styles.circularProgress}>
        <CircularProgress
          value={nutritionSummary.calories}
          maxValue={nutritionGoals.maxCalories}
        />
      </View>
      <View style={styles.nutritionDiagrams}>
        <NutritionDiagrams
          proteins={nutritionSummary.proteins}
          fats={nutritionSummary.fats}
          carbs={nutritionSummary.carbs}
          maxProteins={nutritionGoals.maxProteins}
          maxFats={nutritionGoals.maxFats}
          maxCarbs={nutritionGoals.maxCarbs}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  nutritionDiagrams: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  circularProgress: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

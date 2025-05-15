import {
  useEffect,
  useState,
} from 'react';

import { getAuth } from 'firebase/auth';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import AddFoodControls from '@/components/AddFoodControls';
import IntakesList from '@/components/IntakesList';
import NutritionSummary from '@/components/NutritionSummary';
import { Day } from '@/entities/days/Day';
import { fetchToday } from '@/entities/days/dayGateways';
import {
  IntakeNutrition,
  Nutritions,
} from '@/entities/intakes/Intake';
import { addIntake } from '@/entities/intakes/intakeGateways';

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
      const { nutrition } = intake;
      return {
        calories: acc.calories + nutrition.calories,
        proteins: acc.proteins + nutrition.proteins,
        fats: acc.fats + nutrition.fats,
        carbs: acc.carbs + nutrition.carbs,
      };
    }, initialNutritionSummary) || initialNutritionSummary;

  const handleAddIntake = async (formData: {
    productName: string;
    nutrition: IntakeNutrition;
  }) => {
    const intake = {
      userId,
      productId: null,
      productName: formData.productName,
      nutrition: formData.nutrition,
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
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <NutritionSummary
          nutritionSummary={nutritionSummary}
          maxCalories={maxCalories}
        />

        <AddFoodControls onAddIntake={handleAddIntake} />

        {day?.intakes && (
          <IntakesList
            intakes={day.intakes}
            onIntakeDeleted={() =>
              fetchToday(userId).then((day) => setDay(day))
            }
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  container: {
    display: "flex",
    padding: 8,
    backgroundColor: "#fff",
    color: "#000",
    alignItems: "center",
  },
});

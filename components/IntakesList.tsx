import { Intake } from "@/entities/intakes/Intake";
import { calculateIntakeNutritions } from "@/utils/nutritions.utils";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, IconButton, ActivityIndicator } from "react-native-paper";
import { deleteIntake } from "@/entities/intakes/intakeGateways";
import { getAuth } from "firebase/auth";
import { useState } from "react";

type IntakesListProps = {
  intakes: Intake[];
  onIntakeDeleted?: () => void;
};

export default function IntakesList({ intakes, onIntakeDeleted }: IntakesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (intakeId: string) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    setDeletingId(intakeId);
    try {
      await deleteIntake(userId, intakeId);
      onIntakeDeleted?.();
    } catch (error) {
      console.error("Error deleting intake:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <View style={styles.container}>
      {intakes.map((intake, index) => {
        const nutrition = calculateIntakeNutritions(intake.nutrition);
        const isDeleting = deletingId === intake.id;

        return (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">{intake.productName}</Text>
                {isDeleting ? (
                  <ActivityIndicator size={20} />
                ) : (
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDelete(intake.id)}
                    testID={`delete-intake-${index}`}
                    disabled={deletingId !== null}
                  />
                )}
              </View>
              <View style={styles.nutritionInfo}>
                <Text>Calories: {nutrition.calories.toFixed(0)}</Text>
                <Text>Proteins: {nutrition.proteins.toFixed(1)}g</Text>
                <Text>Fats: {nutrition.fats.toFixed(1)}g</Text>
                <Text>Carbs: {nutrition.carbs.toFixed(1)}g</Text>
              </View>
              <Text variant="bodySmall" style={styles.time}>
                {new Date(intake.createdAt).toLocaleTimeString()}
              </Text>
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 8,
  },
  card: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionInfo: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    marginTop: 8,
    textAlign: "right",
  },
}); 
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Card,
  IconButton,
  Text,
} from 'react-native-paper';
import { Intake } from '@/entities/intakes/Intake';
import { deleteIntake } from '@/entities/intakes/intakeGateways';

type IntakesListProps = {
  intakes: Intake[];
  onIntakeDeleted?: () => void;
  date?: Date;
};

export default function IntakesList({
  intakes,
  onIntakeDeleted,
  date = new Date(),
}: IntakesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDelete = async (intakeId: string) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    setDeletingId(intakeId);
    try {
      await deleteIntake(userId, intakeId, date);
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
        const { nutrition } = intake;
        const isDeleting = deletingId === intake.id;

        return (
          <Card key={index} style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <View style={styles.titleRow}>
                    <Text variant="titleMedium" style={styles.productName}>
                      {intake.productName}
                    </Text>
                    <Text style={styles.gramsText}>
                      {nutrition.grams}г
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={styles.time}>
                    {new Date(intake.createdAt).toLocaleTimeString('uk-UA', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                {isDeleting ? (
                  <ActivityIndicator size={24} color="#6200ee" />
                ) : (
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDelete(intake.id)}
                    testID={`delete-intake-${index}`}
                    disabled={deletingId !== null}
                    iconColor="#ef5350"
                  />
                )}
              </View>

              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Калорії</Text>
                  <Text style={styles.nutritionValue}>{nutrition.calories}</Text>
                  <Text style={styles.nutritionUnit}>kcal</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Білки</Text>
                  <Text style={styles.nutritionValue}>{nutrition.proteins}</Text>
                  <Text style={styles.nutritionUnit}>г</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Жири</Text>
                  <Text style={styles.nutritionValue}>{nutrition.fats}</Text>
                  <Text style={styles.nutritionUnit}>г</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Вуглев.</Text>
                  <Text style={styles.nutritionValue}>{nutrition.carbs}</Text>
                  <Text style={styles.nutritionUnit}>г</Text>
                </View>
              </View>
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
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  cardContent: {
    paddingVertical: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: "#1a1a1a",
  },
  gramsText: {
    fontSize: 13,
    fontWeight: '600',
    color: "#6200ee",
    backgroundColor: "#f3e5f5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  time: {
    color: "#757575",
    fontSize: 13,
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  nutritionItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionLabel: {
    fontSize: 11,
    color: "#757575",
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: "#1a1a1a",
    marginBottom: 2,
  },
  nutritionUnit: {
    fontSize: 11,
    color: "#9e9e9e",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
});

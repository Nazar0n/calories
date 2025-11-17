import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useFocusEffect } from 'expo-router';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddFoodControls from '@/components/AddFoodControls';
import IntakesList from '@/components/IntakesList';
import NutritionSummary from '@/components/NutritionSummary';
import { Day } from '@/entities/days/Day';
import { fetchDayByDate } from '@/entities/days/dayGateways';
import {
  IntakeNutrition,
  Nutritions,
} from '@/entities/intakes/Intake';
import { addIntake } from '@/entities/intakes/intakeGateways';
import {
  DEFAULT_NUTRITION_GOALS,
  NutritionGoals,
} from '@/entities/users/User';
import { getUserById } from '@/entities/users/userGateways';

const initialNutritionSummary: Nutritions = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

export default function HomeScreen() {
  const [day, setDay] = useState<Day | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>(
    DEFAULT_NUTRITION_GOALS
  );
  
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
    };
    await addIntake(userId, intake, selectedDate);
    fetchDayByDate(userId, selectedDate).then((day) => setDay(day));
  };

  const loadDayData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const dayData = await fetchDayByDate(userId, selectedDate);
      setDay(dayData);
    } catch (error) {
      console.error("Error loading day data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сьогодні";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчора";
    } else {
      return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const loadUserGoals = async (uid: string) => {
    try {
      const userData = await getUserById(uid);
      if (userData?.nutritionGoals) {
        setNutritionGoals(userData.nutritionGoals);
      }
    } catch (error) {
      console.error('Error loading user goals:', error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        setUserId(user.uid);
        // Завантажуємо дані користувача, включаючи цільові значення харчування
        await loadUserGoals(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  // Оновлюємо цільові значення при поверненні на екран
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadUserGoals(userId);
      }
    }, [userId])
  );

  useEffect(() => {
    if (userId) {
      loadDayData();
    }
  }, [userId, selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Date Navigation */}
          <View style={styles.dateNavigationSection}>
            <IconButton
              icon="chevron-left"
              size={28}
              onPress={handlePreviousDay}
              iconColor="#6200ee"
            />
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
              {!isToday() && (
                <IconButton
                  icon="calendar-today"
                  size={20}
                  onPress={handleToday}
                  iconColor="#6200ee"
                  style={styles.todayButton}
                />
              )}
            </View>
            <IconButton
              icon="chevron-right"
              size={28}
              onPress={handleNextDay}
              iconColor="#6200ee"
              disabled={isToday()}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6200ee" />
            </View>
          ) : (
            <>
              <View style={styles.nutritionSummarySection}>
                <NutritionSummary
                  nutritionSummary={nutritionSummary}
                  nutritionGoals={nutritionGoals}
                />
              </View>
              
              <View style={styles.controlsSection}>
                <AddFoodControls onAddIntake={handleAddIntake} />
              </View>

              {day?.intakes && day.intakes.length > 0 && (
                <View style={styles.intakesSection}>
                  <Text style={styles.sectionTitle}>Прийоми їжі</Text>
                  <IntakesList
                    intakes={day.intakes}
                    date={selectedDate}
                    onIntakeDeleted={() =>
                      loadDayData()
                    }
                  />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  dateNavigationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: "#1a1a1a",
  },
  todayButton: {
    margin: 0,
    marginLeft: 8,
  },
  nutritionSummarySection: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  controlsSection: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  intakesSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: "#1a1a1a",
    marginBottom: 12,
    marginTop: 4,
  },
});

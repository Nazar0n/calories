import {
  useEffect,
  useState,
} from 'react';
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
  Avatar,
  Button,
  Card,
  Snackbar,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import NutritionGoalsForm from '@/components/NutritionGoalsForm';
import {
  DEFAULT_NUTRITION_GOALS,
  NutritionGoals,
} from '@/entities/users/User';
import {
  getUserById,
  updateUserNutritionGoals,
} from '@/entities/users/userGateways';
import { signOut } from '@/utils/auth';

export default function ProfileScreen() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>(
    DEFAULT_NUTRITION_GOALS
  );
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || '');
        setUserId(user.uid);
        await loadUserData(user.uid);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const userData = await getUserById(uid);
      if (userData?.nutritionGoals) {
        setNutritionGoals(userData.nutritionGoals);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSaveGoals = async (goals: NutritionGoals) => {
    try {
      await updateUserNutritionGoals(userId, goals);
      setNutritionGoals(goals);
      setSnackbarMessage('Налаштування збережено успішно!');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
      setSnackbarMessage('Помилка збереження налаштувань');
      setSnackbarVisible(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (email: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Card style={styles.profileCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.avatarContainer}>
                <Avatar.Text 
                  size={80} 
                  label={getInitials(userEmail)}
                  style={styles.avatar}
                />
              </View>
              <Text variant="headlineMedium" style={styles.title}>
                Профіль
              </Text>
              {userEmail && (
                <View style={styles.emailContainer}>
                  <Text variant="bodyLarge" style={styles.emailLabel}>
                    Email:
                  </Text>
                  <Text variant="bodyLarge" style={styles.email}>
                    {userEmail}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.nutritionCard}>
            <Card.Content>
              <NutritionGoalsForm
                initialGoals={nutritionGoals}
                onSave={handleSaveGoals}
                loading={loading}
              />
            </Card.Content>
          </Card>

          <Card style={styles.settingsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Налаштування
              </Text>
              <Button
                mode="contained"
                onPress={handleSignOut}
                style={styles.logoutButton}
                buttonColor="#d32f2f"
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="logout"
              >
                Вийти з акаунту
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
    padding: 16,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    padding: 24,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#6366f1",
  },
  title: {
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  emailContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginTop: 8,
  },
  emailLabel: {
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  email: {
    color: "#1f2937",
    fontWeight: "600",
  },
  nutritionCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  settingsCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

import {
  useEffect,
  useState,
} from 'react';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import { auth } from '@/FirebaseConfig';
import {
  signIn,
  signUp,
} from '@/utils/auth';

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/home");
      }
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signIn(email, password);
    } catch (err: any) {
      const errorCode = err.code;
      
      switch (errorCode) {
        case 'auth/user-not-found':
          setError("Користувача з таким email не знайдено");
          break;
        case 'auth/wrong-password':
          setError("Неправильний пароль");
          break;
        case 'auth/invalid-email':
          setError("Невірний формат email");
          break;
        case 'auth/invalid-credential':
          setError("Невірний email або пароль");
          break;
        case 'auth/too-many-requests':
          setError("Занадто багато спроб. Спробуйте пізніше");
          break;
        default:
          setError("Помилка входу. Спробуйте ще раз");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError("");
      await signUp(email, password);
    } catch (err: any) {
      const errorCode = err.code;
      
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setError("Користувач з таким email вже існує");
          break;
        case 'auth/invalid-email':
          setError("Невірний формат email");
          break;
        case 'auth/weak-password':
          setError("Пароль занадто слабкий. Мінімум 6 символів");
          break;
        default:
          setError("Помилка реєстрації. Спробуйте ще раз");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        textContentType="emailAddress"
        value={email}
        label="Email"
        onChangeText={setEmail}
        style={styles.input}
        disabled={loading}
      />
      <TextInput
        secureTextEntry
        textContentType="password"
        value={password}
        label="Password"
        onChangeText={setPassword}
        style={styles.input}
        disabled={loading}
      />
      <Button 
        mode="contained" 
        onPress={handleSignIn}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Увійти
      </Button>
      <Button 
        mode="contained" 
        onPress={handleSignUp}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Зареєструватися
      </Button>
      
      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={4000}
        action={{
          label: 'OK',
          onPress: () => setError(""),
        }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
});

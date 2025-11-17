import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { Language } from '@/entities/users/User';
import { createUser } from '@/entities/users/userGateways';
import { auth } from '@/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = "loggedInUser";

export async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    
    // Створюємо документ користувача в Firestore
    await createUser(user.uid, {
      email: user.email || email,
      firstName: '',
      lastName: '',
      height: 0,
      weight: 0,
      dayOfBirth: new Date(),
      language: Language.ua,
    });

    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify({
        uid: user.uid,
        email: user.email,
      })
    );

    if (user) router.replace("/(tabs)/home");

    console.log("User signed up and signed in:", user);
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (user) router.replace("/(tabs)/home");

    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify({
        uid: user.uid,
        email: user.email,
      })
    );

    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function getStoredUser() {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error fetching stored user:", error);
    return null;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    await AsyncStorage.removeItem(USER_KEY);
    router.replace("/");
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

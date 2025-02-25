import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "loggedInUser";

export async function signUp(email: string, password: string) {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify({
        uid: user.uid,
        email: user.email,
      })
    );

    console.log("User signed up and signed in:", user);
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

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
    await auth().signOut();
    await AsyncStorage.removeItem(USER_KEY);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

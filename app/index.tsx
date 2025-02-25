import { StyleSheet, SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { auth } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)/testscreen");
    } catch (e: any) {
      console.log(e);
      alert("Sign in failed: " + e.message);
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)/testscreen");
    } catch (e: any) {
      console.log(e);
      alert("Sign up failed: " + e.message);
    }
  };

  return (
    <SafeAreaView>
      <TextInput textContentType="emailAddress" value={email} label="Email" onChangeText={setEmail} />
      <TextInput textContentType="password" value={password} label="Password" onChangeText={setPassword} />
      <Button mode="contained" onPress={signIn}>
        Login
      </Button>
      <Button mode="contained" onPress={signUp}>
        Make account
      </Button>
    </SafeAreaView>
  );
}

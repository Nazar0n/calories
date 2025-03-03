import { SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { signIn, signUp } from "@/utils/auth";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "@/FirebaseConfig";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/testscreen");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView>
      <TextInput
        textContentType="emailAddress"
        value={email}
        label="Email"
        onChangeText={setEmail}
      />
      <TextInput
        secureTextEntry
        textContentType="password"
        value={password}
        label="Password"
        onChangeText={setPassword}
      />
      <Button mode="contained" onPress={() => signIn(email, password)}>
        Login
      </Button>
      <Button mode="contained" onPress={() => signUp(email, password)}>
        Make account
      </Button>
    </SafeAreaView>
  );
}

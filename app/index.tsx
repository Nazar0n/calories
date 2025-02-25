import { SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { signIn, signUp } from "@/utils/auth";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

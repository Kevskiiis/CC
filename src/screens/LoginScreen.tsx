// src/screens/LoginScreen.tsx
import React, { useState } from "react"; // ⬅️ include React here
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";


// React Native Paper
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Appbar } from "react-native-paper";

// Auth + utils
import { responsive } from "../utils/responsive";
import { useAuth } from "../context/AuthContext";
import { verifyUser } from "../services/auth";

type Props = NativeStackScreenProps<any>;

type LoginForm = {
  email: string;
  password: string;
};

function LoginScreen({ navigation }: Props) {
  const [loginForm, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  function handleChange(inputName: keyof LoginForm, newText: string) {
    setForm((prev) => ({ ...prev, [inputName]: newText }));
  }

  const isValid =
    loginForm.email.trim().length > 0 && loginForm.password.trim().length > 0;

  async function handleSubmit() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setErr(null);

    const res = await verifyUser({
      identifier: loginForm.email.trim(),
      password: loginForm.password.trim(),
    });

    setSubmitting(false);

    if (!res.ok) {
      setErr(res.message);
      return;
    }

    // Success: promote to global auth → Home
    signIn();
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewInside}
          enableOnAndroid
          extraScrollHeight={responsive.number(20)}
          enableAutomaticScroll
        >
          <View style={styles.formContainer}>
            <Appbar.Header style={styles.appBar}>
              <Appbar.Content
                titleStyle={styles.appBarTitle}
                title="LOGIN"
                color="#DDA853"
              />
              <Appbar.Action
                style={styles.appBarItem}
                icon="arrow-left"
                color="#1a1a1aff"
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back"
              />
            </Appbar.Header>

            <TextInput
              style={styles.textInput}
              label="Email"
              placeholder="example@gmail.com"
              mode="flat"
              underlineColor="#1a1a1aff"
              activeUnderlineColor="#1a1a1aff"
              value={loginForm.email}
              onChangeText={(t: string) => handleChange("email", t)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <TextInput
              style={styles.textInput}
              label="Password"
              placeholder="Password1!"
              mode="flat"
              underlineColor="#1a1a1aff"
              activeUnderlineColor="#1a1a1aff"
              value={loginForm.password}
              onChangeText={(t: string) => handleChange("password", t)}
              secureTextEntry={!showPassword}
              autoComplete="password"
              returnKeyType="go"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword((s: boolean) => !s)} // typed 's'
                />
              }
              onSubmitEditing={handleSubmit}
            />

            {!!err && <Text style={{ color: "red" }}>{err}</Text>}

            <TouchableOpacity
              style={[
                styles.submitButton,
                { opacity: isValid && !submitting ? 1 : 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={!isValid || submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? "SIGNING IN…" : "SIGN IN"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#D2C1B6",
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    width: responsive.number(300),
    height: responsive.number(60),
    borderRadius: responsive.number(4),
    borderWidth: responsive.number(2),
    backgroundColor: "#1a1a1aff",
  },
  submitButtonText: {
    fontWeight: "500",
    fontSize: responsive.number(15),
    color: "#DDA853",
    letterSpacing: responsive.number(2),
  },
  textInput: {
    flexDirection: "row",
    width: responsive.number(300),
    height: responsive.number(60),
    backgroundColor: "#ecececff",
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: responsive.number(80),
    backgroundColor: "#1a1a1aff",
  },
  appBarTitle: {
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "800",
    letterSpacing: responsive.number(0.5),
  },
  appBarItem: {
    width: responsive.number(100),
    height: responsive.number(60),
    color: "#ffffffff",
    backgroundColor: "#DDA853",
  },
  scrollViewInside: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: responsive.number(20),
    backgroundColor: "#D2C1B6",
  },
  formContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: responsive.number(20),
    paddingBottom: responsive.number(40),
    width: "90%",
    height: "auto",
    borderWidth: responsive.number(6),
    borderRadius: responsive.number(8),
    borderColor: "#1a1a1aff",
    backgroundColor: "#F5F5F0",
  },
});
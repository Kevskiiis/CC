// src/screens/RegisterScreen.tsx
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "react-native-phone-input";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";


// UI
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Appbar } from "react-native-paper";

// Utils & services
import { responsive } from "../utils/responsive";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/auth";
import { upsertProfile } from "../services/profile";
import { supabase } from "../lib/supabase"; // ⬅️ needed to set Auth display_name

type Props = NativeStackScreenProps<any>;

type RegisterForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

function RegisterScreen({ navigation }: Props) {
  const [registerForm, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signIn } = useAuth();

  function handleChange(inputName: keyof RegisterForm, newText: string) {
    setForm((prev) => ({ ...prev, [inputName]: newText }));
  }

  const isValid =
    registerForm.email.trim().length > 0 &&
    registerForm.password.trim().length > 0;

  // Create account → save profile → set display_name → signIn() → Home
  async function handleSubmit() {
    if (!isValid || submitting) return;

    setSubmitting(true);
    setErr(null);

    // 1) Create the Supabase Auth user
    const res = await registerUser(
      registerForm.email.trim(),
      registerForm.password.trim()
    );

    if (!res.ok) {
      setSubmitting(false);
      setErr(res.message);
      return;
    }


    const { data: auth } = await supabase.auth.getUser();
        console.log("auth uid:", auth.user?.id);
        console.log("payload id:", res.user!.id);
    // 2) Save profile fields into your 'profiles' table (id = auth.users.id)
    await upsertProfile({
      userId: res.user!.id,
      firstName: registerForm.firstName.trim() || undefined,
      lastName: registerForm.lastName.trim() || undefined,
      phoneNumber: registerForm.phoneNumber.trim() || undefined,
    });

    // 3) Set the single Display name in Supabase Auth (what you see in Auth → Users)
   const displayName = `${registerForm.firstName} ${registerForm.lastName}`.trim() || null;
        await supabase.auth.updateUser({
        data: { full_name: displayName, display_name: displayName } // <- use full_name
    });

    // 4) Flip auth gate → MainRoutes/Home
    setSubmitting(false);
    signIn();
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewInside}
          enableOnAndroid
          extraScrollHeight={responsive.number(80)}
          enableAutomaticScroll
        >
          <View style={styles.formContainer}>
            <Appbar.Header style={styles.appBar}>
              <Appbar.Content
                titleStyle={styles.appBarTitle}
                title="CREATE ACCOUNT"
                color="#DDA853"
              />
              <Appbar.Action
                style={styles.appBarItem}
                icon="arrow-left"
                color="#1a1a1aff"
                onPress={() => navigation.goBack()}
              />
            </Appbar.Header>

            <TextInput
              style={styles.textInput}
              label="First Name"
              placeholder="John"
              mode="flat"
              underlineColor="#1a1a1aff"
              activeUnderlineColor="#1a1a1aff"
              value={registerForm.firstName}
              onChangeText={(t: string) => handleChange("firstName", t)}
            />

            <TextInput
              style={styles.textInput}
              label="Last Name"
              placeholder="White"
              mode="flat"
              underlineColor="#1a1a1aff"
              activeUnderlineColor="#1a1a1aff"
              value={registerForm.lastName}
              onChangeText={(t: string) => handleChange("lastName", t)}
            />

            <PhoneInput
              initialCountry="us"
              autoFormat
              style={styles.phoneInput}
              textStyle={{ fontSize: responsive.number(16) }}
              flagStyle={{
                width: responsive.number(30),
                height: responsive.number(20),
              }}
              initialValue={registerForm.phoneNumber}
              onChangePhoneNumber={(t: string) =>
                handleChange("phoneNumber", t)
              }
            />

            <TextInput
              style={styles.textInput}
              label="Email"
              placeholder="example@gmail.com"
              mode="flat"
              underlineColor="#1a1a1aff"
              activeUnderlineColor="#1a1a1aff"
              value={registerForm.email}
              onChangeText={(t: string) => handleChange("email", t)}
              autoCapitalize="none"
              keyboardType="email-address"
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
              value={registerForm.password}
              onChangeText={(t: string) => handleChange("password", t)}
              secureTextEntry
              autoComplete="password-new"
              returnKeyType="go"
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
                {submitting ? "SIGNING UP…" : "SIGN UP"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: "column", backgroundColor: "#D2C1B6" },
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
    fontFamily: "300",
    fontSize: responsive.number(20),
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
    gap: responsive.number(15),
    paddingBottom: responsive.number(40),
    width: "90%",
    height: "auto",
    borderWidth: responsive.number(6),
    borderRadius: responsive.number(8),
    borderColor: "#1a1a1aff",
    backgroundColor: "#F5F5F0",
  },
  phoneInput: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    borderTopRightRadius: responsive.number(4),
    borderTopLeftRadius: responsive.number(4),
    borderBottomWidth: responsive.number(0.5),
    borderColor: "#1a1a1aff",
    fontSize: responsive.number(16),
    width: responsive.number(300),
    height: responsive.number(60),
    color: "#1a1a1aff",
    backgroundColor: "#ecececff",
  },
});
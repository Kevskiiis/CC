import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { COLORS } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
// If you prefer to force navigation after sign out, uncomment these:
// import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  // const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      setBusy(true);
      await signOut(); // flips auth state and calls Supabase signOut

      // OPTIONAL: If you want to *force* jump to Landing immediately,
      // even before OpeningRoutes re-renders, uncomment:
      // (Make sure your screen name matches — "LandingScreen" in OpeningRoutes)
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: "LandingScreen" as never }],
      // });

    } catch (e: any) {
      Alert.alert("Sign out failed", e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity
          style={[styles.primaryBtn, busy && { opacity: 0.7 }]}
          onPress={handleSignOut}
          disabled={busy}
        >
          <Text style={styles.primaryBtnText}>
            {busy ? "Signing out…" : "Sign out"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background, // keep global app background
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text, // plain text on light bg
  },
  primaryBtn: {
    width: "90%",
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,       // same filled button color
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryText,             // your beige/gold on dark button
    letterSpacing: 0.5,
  },
});
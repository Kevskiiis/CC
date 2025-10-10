import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../themes/colors"; // adjust path if needed

export default function HomeScreen() {
  const [code, setCode] = useState("");

  const onJoin = () => {
    // TODO: validate and navigate to community by code
    console.log("Join with code:", code);
  };

  const onCreate = () => {
    // TODO: navigate to create community flow
    console.log("Create community");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter community code"
          placeholderTextColor={COLORS.textDim}
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onJoin}>
          <Text style={styles.primaryBtnText}>Join</Text>
        </TouchableOpacity>

        <Text style={styles.orLabel}>or</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={onCreate}>
          <Text style={styles.primaryBtnText}>Create Community</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background, // same app background
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  primaryBtn: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary, // your beige button color
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: {
    color: COLORS.onPrimary,
    fontWeight: "700",
    fontSize: 20,
  },
  orLabel: {
    marginVertical: 16,
    color: COLORS.text,
    opacity: 0.8,
    fontSize: 18,
  },
});
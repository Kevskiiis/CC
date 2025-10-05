// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../services/profile";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    (async () => {
      // 1) Try profiles table
      const prof = await getMyProfile();
      if (prof.ok && prof.profile) {
        const full = `${prof.profile.first_name ?? ""} ${prof.profile.last_name ?? ""}`.trim();
        if (full) {
          setDisplayName(full);
          return;
        }
      }
      // 2) Fallback to Auth metadata display_name
      const { data } = await supabase.auth.getUser();
      const metaName = (data.user?.user_metadata as any)?.display_name as string | undefined;
      if (metaName && metaName.trim()) {
        setDisplayName(metaName.trim());
        return;
      }
      // 3) Fallback to email
      setDisplayName(data.user?.email ?? "User");
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.hi}>Welcome, {displayName}</Text>
      <TouchableOpacity style={styles.btn} onPress={signOut}>
        <Text style={styles.btnText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  hi: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  btn: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, borderWidth: 2 },
  btnText: { fontSize: 18 },
});
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type RowProps = {
  icon: React.ComponentProps<typeof Icon>["name"];
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

function Row({ icon, title, subtitle, onPress }: RowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <Icon name={icon} size={22} color={COLORS.textOnDark} />
      </View>
      <View style={styles.rowCenter}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-right" size={24} color={COLORS.textOnDark} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!mounted || !user) return;

      setEmail(user.email ?? null);

      // 1) Try profiles table (authoritative for your app)
      let fullNameFromProfile: string | null = null;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name,last_name,username")
          .eq("id", user.id)
          .single();

        if (profile) {
          const first = (profile.first_name ?? "").trim();
          const last = (profile.last_name ?? "").trim();
          const uname = (profile.username ?? "").trim();
          const full =
            [first, last].filter(Boolean).join(" ").trim() || uname || "";
          fullNameFromProfile = full || null;
        }
      } catch {
        // ignore – we’ll fall back below
      }

      // 2) Try auth user metadata “display name” (if you set it during signup)
      const metaName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        (user.user_metadata?.display_name as string | undefined) ||
        "";

      // 3) Final fallback: email prefix
      const fromEmail =
        (user.email ? user.email.split("@")[0] : "").trim() || "Your account";

      const finalName = (fullNameFromProfile || metaName || fromEmail).trim();
      if (mounted) setDisplayName(finalName);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const initials =
    displayName
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((s: string) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn}>
                <Icon name="pencil" size={16} color={COLORS.primaryText} />
                <Text style={styles.headerBtnText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtnSecondary}>
                <Icon name="account-multiple" size={16} color={COLORS.text} />
                <Text style={styles.headerBtnTextSecondary}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* “Write a bio” card */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconWrap}>
            <Icon name="account-details" size={22} color={COLORS.textOnDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Write a bio</Text>
            <Text style={styles.tipBody}>
              Add a bio to your profile to share more about yourself!
            </Text>
          </View>
          <Icon name="close" size={20} color={COLORS.textOnDark} />
        </View>

        {/* List */}
        <Row
          icon="school-outline"
          title="Manage Your Communities"
          onPress={() => {}}
        />
        <Row
          icon="bell-outline"
          title="Update Chat Notification Settings"
          onPress={() => {}}
        />
        <Row icon="eye-outline" title="Profile Preview" onPress={() => {}} />
        <Row
          icon="newspaper-variant-outline"
          title="Community Updates"
          onPress={() => {}}
        />
        <Row
          icon="account-group-outline"
          title="Social Notification Settings"
          onPress={() => {}}
        />
        <Row
          icon="shield-lock-outline"
          title="Privacy and App Settings"
          onPress={() => {}}
        />
        <Row
          icon="help-circle-outline"
          title="Account Help Center"
          onPress={() => {}}
        />

        {/* App Theme row with trailing “Auto” */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icon name="theme-light-dark" size={22} color={COLORS.textOnDark} />
          </View>
          <View style={styles.rowCenter}>
            <Text style={styles.rowTitle}>App Theme</Text>
          </View>
          <Text style={styles.trailingText}>Auto</Text>
          <Icon name="chevron-right" size={24} color={COLORS.textOnDark} />
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  avatarWrap: { width: 64, height: 64 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3B3B46",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.textOnDark, fontSize: 22, fontWeight: "800" },
  completionPill: {
    position: "absolute",
    bottom: -6,
    left: -6,
    backgroundColor: "#FF7A00",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  completionText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  name: { color: COLORS.text, fontSize: 22, fontWeight: "800", marginBottom: 10 },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerBtnText: { color: COLORS.primaryText, fontWeight: "700" },
  headerBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2e2e35",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerBtnTextSecondary: { color: COLORS.text, fontWeight: "700" },

  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2e2e35",
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: { color: COLORS.text, fontWeight: "800", fontSize: 16 },
  tipBody: { color: COLORS.textOnDark, marginTop: 4 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  rowLeft: { width: 28, alignItems: "center" },
  rowCenter: { flex: 1 },
  rowTitle: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  rowSub: { color: COLORS.textOnDark, marginTop: 2 },
  trailingText: { color: COLORS.textOnDark, marginRight: 6 },

  signOutBtn: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: { color: COLORS.primaryText, fontSize: 16, fontWeight: "700" },
});
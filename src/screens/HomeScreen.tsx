import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        Welcome{user?.username ? `, ${user.username}` : user?.email ? `, ${user.email}` : "!"}
      </Text>

      <TouchableOpacity
        onPress={signOut}
        style={{ paddingHorizontal: 18, paddingVertical: 12, borderWidth: 2, borderRadius: 10 }}
      >
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
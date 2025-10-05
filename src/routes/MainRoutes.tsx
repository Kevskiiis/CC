import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";

// If you have other non-tab screens (modals/details), add them here later.
type MainStackParamList = {
  Tabs: undefined;
  // Details: { id: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 👇 This mounts your bottom tab navigator */}
      <Stack.Screen name="Tabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainRoutes from "./MainRoutes"; // your bottom tabs/inner app
import { useAuth } from "../context/AuthContext";

// No generics here on purpose to avoid type friction with existing screens
const Stack = createNativeStackNavigator();

export default function OpeningRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Signed in → go straight to your main app (tabs)
        <Stack.Screen name="Main" component={MainRoutes} />
      ) : (
        // Not signed in → show your original opening flow
        <>
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
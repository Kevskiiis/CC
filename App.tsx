// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import OpeningRoutes from "./src/routes/OpeningRoutes";
import MainRoutes from "./src/routes/MainRoutes";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

function RootNav() {
  const { isAuthenticated } = useAuth(); // ⬅️ no 'loading'
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainRoutes /> : <OpeningRoutes />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNav />
    </AuthProvider>
  );
}

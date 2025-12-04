import { useState, useEffect, JSX } from "react";
import { View } from "react-native";

// Screens:
import HomeScreen from "../screens/PrivateScreens/HomeScreen";


type routeTypes = {
    home: React.ReactElement
}

export default function HomeDirectory() {
    type RouteKey = "home";

    const [screen, setScreen] = useState<RouteKey>("home");

    const routes: Record<RouteKey, JSX.Element> = {
        home: <HomeScreen />,
    };

  return (
    <View style={{ flex: 1 }}>
        {routes[screen]}
    </View>
  );
}
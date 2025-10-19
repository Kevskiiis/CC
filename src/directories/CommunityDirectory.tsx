import { useState, useEffect, JSX } from "react";
import { View } from "react-native";

// Screens:
import CommunityScreen from "../screens/PrivateScreens/CommunityScreen";

// Routes & Types:
type routeTypes = {
    post: React.ReactElement
}

export default function CommunityDirectory() {
    type RouteKey = "communities";

    const [screen, setScreen] = useState<RouteKey>("communities");

    const routes: Record<RouteKey, JSX.Element> = {
        communities: <CommunityScreen/>,
    };

  return (
    <View style={{ flex: 1 }}>
        {routes[screen]}
    </View>
  );
}
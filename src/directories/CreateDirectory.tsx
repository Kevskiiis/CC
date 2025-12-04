import { useState, useEffect, JSX } from "react";
import { View } from "react-native";

// Screens:
import PostScreen from "../screens/PrivateScreens/PostScreen";

// Routes & Types:
type routeTypes = {
    post: React.ReactElement
}

export default function CreateDirectory() {
    type RouteKey = "post";

    const [screen, setScreen] = useState<RouteKey>("post");

    const routes: Record<RouteKey, JSX.Element> = {
        post: <PostScreen/>,
    };

  return (
    <View style={{ flex: 1 }}>
        {routes[screen]}
    </View>
  );
}
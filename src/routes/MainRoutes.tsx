import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

export type MainRoutesStackParams = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<MainRoutesStackParams>();

export default function MainRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
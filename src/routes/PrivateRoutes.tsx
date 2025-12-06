import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens:
import PrivateScreenTemplate from "../screens/Templates/PrivateScreenTemplate";
import SettingsScreen from "../screens/SettingsScreen";

// Route Params:
export type PrivateRoutesStackParams = {
  'PrivateScreenTemplates': undefined;
  'Settings': undefined;
}

// Navigator:
const Stack = createNativeStackNavigator<PrivateRoutesStackParams>(); 

function PrivateRoutes () { 
    return (
        <Stack.Navigator initialRouteName='PrivateScreenTemplates'>
            <Stack.Screen
                name="PrivateScreenTemplates"
                component={PrivateScreenTemplate}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: true, title: "Settings" }}
            />
        </Stack.Navigator>
    )
}
export default PrivateRoutes;

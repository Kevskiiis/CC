import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens:
import HomeScreen from '../screens/PrivateScreens/HomeScreen';

// Route Params:
export type PrivateRoutesStackParams = {
  'HomeScreen': undefined;
}

// Navigator:
const Stack = createNativeStackNavigator<PrivateRoutesStackParams>(); 

function PrivateRoutes () { 
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}
export default PrivateRoutes;
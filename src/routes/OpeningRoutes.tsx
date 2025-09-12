import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Pages:
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Route Params:
export type OpeningRoutesStackParams = {
  'LandingScreen': undefined;
  'LoginScreen': undefined;
  'RegisterScreen': undefined; 
}

// Navigator:
const Stack = createNativeStackNavigator<OpeningRoutesStackParams>(); 

function OpeningRoutes () {
    return (
        <Stack.Navigator initialRouteName='LandingScreen'>
            <Stack.Screen 
                name='LandingScreen' 
                component={LandingScreen} 
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='LoginScreen'
                component={LoginScreen}
                options={{headerShown: false}}
             />
             <Stack.Screen
                name='RegisterScreen'
                component={RegisterScreen}
                options={{headerShown: false}}
             />
        </Stack.Navigator>
    );
}
export default OpeningRoutes;
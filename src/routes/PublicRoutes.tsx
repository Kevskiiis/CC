import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Screens:
import LandingScreen from '../screens/PublicScreens/LandingScreen';
import LoginScreen from '../screens/PublicScreens/LoginScreen';
import RegisterScreen from '../screens/PublicScreens/RegisterScreen';

// Route Params:
export type PublicRoutesStackParams = {
  'LandingScreen': undefined;
  'LoginScreen': undefined;
  'RegisterScreen': undefined; 
}

// Navigator:
const Stack = createNativeStackNavigator<PublicRoutesStackParams>(); 

function PublicRoutes () {
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
export default PublicRoutes;

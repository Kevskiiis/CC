import {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screeens:
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';

// Routes:
import OpeningRoutes from './src/routes/OpeningRoutes';

// Navigators:
const Stack = createNativeStackNavigator(); 

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 


  return (
    <NavigationContainer>
      
      {!isAuthenticated && 
        <OpeningRoutes/>
      }
      {isAuthenticated &&
        <Text>Hi</Text>
      }

    </NavigationContainer>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
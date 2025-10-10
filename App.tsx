import {useState} from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

// Routes:
import PublicRoutes from './src/routes/PublicRoutes';
import PrivateRoutes from './src/routes/PrivateRoutes'; 

// Comntexts:
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <NavigationContainer>
      {!isAuthenticated && <PublicRoutes/>}
      {isAuthenticated && <PrivateRoutes/>}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
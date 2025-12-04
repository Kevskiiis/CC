import {useState} from 'react';
import { StyleSheet } from 'react-native';

// Routes:
import RoutesContainer from './src/routes/RoutesContainer';

// Contexts:
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <RoutesContainer/>
        </AuthProvider>
    );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNav />
    </AuthProvider>
  );
}

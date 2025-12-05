import React from 'react';

// Routes:
import RoutesContainer from './src/routes/RoutesContainer';

// Contexts:
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RoutesContainer />
    </AuthProvider>
  );
}

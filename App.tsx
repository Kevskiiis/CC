import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Unauthenticated stack (Landing → Login / Register)
import OpeningRoutes from './src/routes/OpeningRoutes';

// Authenticated stack (Home and whatever else you add)
import MainRoutes from './src/routes/MainRoutes';

// Auth context
import { AuthContext, type User } from './src/context/AuthContext';

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);         // future: show spinners during real verify
  const [error, setError] = useState<string | null>(null); // future: surface login errors
  const [user, setUser] = useState<User>(null);

  const authValue = useMemo(
    () => ({
      isAuthenticated,
      loading,
      error,
      user,
      // Later: call your real verify API. On success, set user and flip auth.
      signIn: (u?: NonNullable<User>) => {
        setLoading(false);
        setError(null);
        if (u) setUser(u);
        setIsAuthenticated(true);
      },
      signOut: () => {
        setIsAuthenticated(false);
        setUser(null);
        setError(null);
        setLoading(false);
      },
    }),
    [isAuthenticated, loading, error, user]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <NavigationContainer>
        {!isAuthenticated && <OpeningRoutes />}
        {isAuthenticated && <MainRoutes />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
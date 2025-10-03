import { createContext, useContext } from 'react';

export type User = {
  id?: string;
  email?: string;
  username?: string;
} | null;

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User;
  // Call signIn() after your real verify succeeds (you can also pass a user)
  signIn: (user?: NonNullable<User>) => void;
  // Clears auth and returns to OpeningRoutes
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthContext.Provider>');
  return ctx;
}
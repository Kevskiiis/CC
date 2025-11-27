import { useContext, createContext, useState, useEffect} from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import * as SecureStore from 'expo-secure-store';

// Supabase Client:
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Object Types:
type returningUser = {
    email: string;
    password: string;
}

type newUser = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string; 
}

type AuthContextType = {
    isAuthenticated: boolean;
    signIn: (user: returningUser) => Promise<void>;
    signOut: () => Promise<void>;
    createAccount: (newUser: newUser) => Promise<void>;
    restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider ({children}: {children: React.ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const signIn = async (user: returningUser) => {
        const {email, password} = user;

        try {
            // Attempt to login the user with email and password
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

             if (error) {
                console.error("Login error:", error.message);
                setIsAuthenticated(false);
                return;
            }
            if (data.session) {
                await SecureStore.setItemAsync("RefreshToken", data.session.refresh_token);
                await SecureStore.setItemAsync("AccessToken", data.session.access_token);
                setIsAuthenticated(true);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    
    const signOut = async () => {
        try {
            const {error} = await supabase.auth.signOut();
            if (error) console.error("Sign out error:", error.message);

            await SecureStore.deleteItemAsync("RefreshToken");
            await SecureStore.deleteItemAsync("AccessToken");
            setIsAuthenticated(false);
        }   
        catch (err) {
            console.error(err);
        }
    }

    const createAccount = async (newUser: newUser) => {
        const { email, password, firstName, lastName, phoneNumber } = newUser;

        try {
            // Create the user in Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                console.error("Sign up error:", error.message);
                return;
            }

            // Get the newly created user ID
            const user = data.user;
            if (!user) {
                console.error("No user returned from signUp");
                return;
            }

            // Insert the rest of the profile info in your 'profiles' table
            const { error: profileError } = await supabase.from("profiles").insert({
                profile_id: user.id,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                created_at: new Date(),
            });

            if (profileError) {
                console.error("Profile creation error:", profileError.message);
                return;
            }

            // Store tokens if a session was created
            if (data.session) {
                await SecureStore.setItemAsync("AccessToken", data.session.access_token);
                await SecureStore.setItemAsync("RefreshToken", data.session.refresh_token);
                setIsAuthenticated(true);
            } else {
                // If you’re using email confirmation, the session may be null until verified:
                console.log("User created, waiting for email verification.");
            }
        } 
        catch (err) {
            console.error("CreateAccount exception:", err);
        }
    };

    const handleResetPassword = (email: string, newPassword: string) => {
        
    }


    const restoreSession = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync("RefreshToken");
            const accessToken = await SecureStore.getItemAsync("AccessToken");

            if (refreshToken && accessToken) {
                const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                if (error) {
                    console.error("Session restore error:", error.message);
                    setIsAuthenticated(false);
                    return;
                }

                if (data.session) {
                    await SecureStore.setItemAsync("AccessToken", data.session.access_token);
                    await SecureStore.setItemAsync("RefreshToken", data.session.refresh_token);
                    setIsAuthenticated(true);
                }
            } 
            else {
                console.log("No tokens found.");
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error("RestoreSession exception:", err);
            setIsAuthenticated(false);
        }
    };

    // When the component mounts, see if there is a session to restore:
    useEffect (() => {
        restoreSession();
    },[]);

    return (
        <AuthContext.Provider value={{isAuthenticated, signIn, signOut, createAccount, restoreSession}}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to access AuthContext:
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

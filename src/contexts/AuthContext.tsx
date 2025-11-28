import { useContext, createContext, useState, useEffect} from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";

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
    restoreUser: () => Promise<void>;
    setAuthenicatedStatus: (newStatus: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider ({children}: {children: React.ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const restoreUser = async () => {
        try {
            if (isAuthenticated) return; 

            const refreshToken = await SecureStore.getItemAsync("refresh_token");

            console.log(refreshToken);

            // Handle the edge case if there is none:
            const result = await axios.post(
                'https://ccbackend-production-5adb.up.railway.app/restore-session',
                {},                                  
                {
                    headers: {
                        refreshtoken: refreshToken
                    },
                }
            );

            // Extract the data:
            const data = result.data;

            // console.log(data.access_token);
            // console.log(data.refresh_token);

            // Handle Success: 
            if (data.success) {
                await SecureStore.setItemAsync("access_token", String(data.access_token));
                await SecureStore.setItemAsync("refresh_token", String(data.refresh_token));
                setIsAuthenticated(true);
            }
        } 
        catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data?.message);
            }
            else {
                console.log("Unexpected error:", err);
            }
        }
    };

    // SetAuthenticated:
    const setAuthenicatedStatus = async (newStatus: boolean) => {
        setIsAuthenticated(newStatus);
    }

    // When the component mounts, see if there is a session to restore:
    useEffect (() => {
        restoreUser();
    },[]);

    return (
        <AuthContext.Provider value={{isAuthenticated, restoreUser, setAuthenicatedStatus}}>
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

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
                // The user was unable to login, so isAuthenticated will remain false.
                // setIsAuthenticated(false);
            }
            else {
                await SecureStore.setItemAsync('AuthToken', data.session.refresh_token)
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
            setIsAuthenticated(false);
            await SecureStore.deleteItemAsync('AuthToken');
        }   
        catch (err) {
            console.error(err);
        }
    }

    const createAccount = async (newUser: newUser) => {
        try {
            
        }       
        catch (err) {
            console.error(err);
        }
    }

    const restoreSession = async () => {
        try {
            const token = await SecureStore.getItemAsync('AuthToken');
            // const { data, error } = await supabase.auth.setSession({ refresh_token: token });
            // if (data.session) setIsAuthenticated(true);

        }
        catch (err) {
            console.error(err);
        }
    }

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
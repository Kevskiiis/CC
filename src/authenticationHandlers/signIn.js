import { supabase } from "../api/supabase/globalSupabaseClient.js"; 
import { ErrorHandler } from "../objects/errorHandler.js";

// SIGN IN
export async function signIn (trimmedEmail, trimmedPassword) {
    // Attempt to login with Supabase:
    const { data, error} = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword
    })

    // Handle Supabase Error:
    if (error) throw new ErrorHandler(`Login failed: ${error.message}`, 401); 

    // Handle No Session: 
    if (!data.session) throw new ErrorHandler("Login failed: Invalid login credentials.", 401);

    // Success:
    return {
        success: true,
        message: 'Login successful!',
        userID: data.user.id,
        refresh_token: data.session.refresh_token,
        access_token: data.session.access_token
    }
}
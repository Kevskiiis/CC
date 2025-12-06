import { supabase } from "../api/supabase/globalSupabaseClient.js";
import { ErrorHandler } from "../objects/errorHandler.js";

export async function signOut(accessToken, refreshToken) {
    // Temporarily set the session for this user
    const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    if (sessionError) {
        throw new ErrorHandler("Failed to set user session for logout.", 500);
    }

    // Now sign out
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
        throw new ErrorHandler("Failed to logout user.", 500);
    }

    return { success: true, message: "User logged out successfully." };
}
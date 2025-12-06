import { supabase } from "../api/supabase/globalSupabaseClient.js";
import { ErrorHandler } from "../objects/errorHandler.js";

export async function restoreSession (refreshToken) {
    const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
    });

    if (error || !data?.session) {
        throw new ErrorHandler("There was an error refreshing your session. Try again.", 500);
    }

    return {
        success: true,
        message: 'Session refreshed successfully.',
        data: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at
        }
    };
}
import { supabase } from "../api/supabase/privalagedSupabaseClient.js";
import { ErrorHandler } from "../objects/errorHandler.js";

export async function getImagePublicUrl(bucketName, filePath) {
    if (filePath === null) {
        return {
            success: false, 
            url: null
        }
    }

    const { data, error } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    if (error) {
        throw new ErrorHandler("The image failed to fetch. Please try refreshing.");
    }
    return {
        success: true,
        url: data.publicUrl
    };
}
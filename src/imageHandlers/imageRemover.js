import { supabase } from "../api/supabase/privalagedSupabaseClient.js";
import { ErrorHandler } from "../objects/errorHandler.js";

export async function imageRemover(bucketName, filePath) {
    const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]); // Note: remove() takes an array of file paths

    // Handle supabase storage error:
    if (error) {
        throw new ErrorHandler(`Failed to remove image: ${error.message}. Try again!`, 500);
    }

    // Success
    return {
        success: true,
        message: 'Image was removed successfully!',
        data: data 
    };
}
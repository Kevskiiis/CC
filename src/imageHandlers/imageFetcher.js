import { supabase } from "../api/supabase/privalagedSupabaseClient.js";
import { ErrorHandler } from "../objects/errorHandler.js";

export async function imageFetcher(bucketName, filePath) {
    const { data, error } = await supabase.storage
        .from(bucketName)
        .download(filePath);

    // Handle supabase storage error:
    if (error) {
        throw new ErrorHandler(`Failed to fetch image: ${error.message}. Try again!`, 500);
    }

    // Success - data is a Blob
    return {
        success: true,
        message: 'Image was fetched successfully!',
        data: data // This is a Blob object
    };
}
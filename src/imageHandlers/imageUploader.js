import { supabase } from "../api/supabase/privalagedSupabaseClient.js";
import { ErrorHandler } from "../objects/errorHandler.js";

export async function imageUploader (bucketName, filePath, image) {
    const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, image.buffer, {
      contentType: image.mimetype,
      upsert: true 
    });

    // Handle supabase storage error:
    if (error) {
        throw new ErrorHandler(`Failed to upload image: ${error.message}. Try again!`, 500);
    }

    // Success
    return {
        success: true,
        message: 'Image was uploaded correctly!',
        data: data 
    };
}
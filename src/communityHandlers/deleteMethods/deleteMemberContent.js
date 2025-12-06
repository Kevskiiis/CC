import { ErrorHandler } from "../../objects/errorHandler.js";
import { imageRemover } from "../../imageHandlers/imageRemover.js";

/**
 * Deletes all files for a member's content (posts and announcements) in Supabase Storage.
 *
 * @param {Array} contentArray - Array of objects with content_type, content_id, attachment_url, public_url
 * @param {object} supabaseClient - Supabase client instance (optional if imageRemover uses global client)
 * @param {string} bucketName - Name of the Supabase storage bucket
 * @returns {Promise<Array>} - Array of results for each file deleted
 * @throws {ErrorHandler} - If deletion fails for any file
 */
export async function deleteMemberContent(contentArray, bucketName) {
    if (!Array.isArray(contentArray) || contentArray.length === 0) return [];

    const results = [];

    for (const item of contentArray) {
        const filesToDelete = [];

        // Collect both attachment_url and public_url if they exist
        if (item.attachment_url) filesToDelete.push(item.attachment_url);
        if (item.public_url) filesToDelete.push(item.public_url);

        for (const filePath of filesToDelete) {
            try {
                const res = await imageRemover(bucketName, filePath);
                results.push({
                    content_id: item.content_id,
                    content_type: item.content_type,
                    filePath,
                    success: res.success,
                    message: res.message
                });
            } catch (err) {
                // Wrap in ErrorHandler if not already
                if (err instanceof ErrorHandler) throw err;
                throw new ErrorHandler(`Failed to delete file ${filePath}: ${err.message}`, 500);
            }
        }
    }
    return results;
}

import { ErrorHandler } from "../../objects/errorHandler.js";
import { imageRemover } from "../../imageHandlers/imageRemover.js";

/**
 * Deletes a community and all associated content.
 * 
 * Steps:
 * 1. Fetch all attachment URLs for posts, announcements, and the community itself.
 * 2. Delete each file from Supabase Storage.
 * 3. Delete all related database records using the SQL function.
 * 
 * @param {number} communityID - ID of the community to delete
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteCommunity(communityID, supabaseClient) {
    try {
        // Step 1: Fetch all files for deletion
        const { data: files, error: fetchError } = await supabaseClient
            .rpc("get_community_files_for_cleanup", { p_community_id: communityID });

        if (fetchError) {
            throw new ErrorHandler(`Failed to fetch community files: ${fetchError.message}`, 500);
        }

        // Step 2: Delete files from Supabase Storage
        if (files && Array.isArray(files) && files.length > 0) {
            for (const file of files) {
                if (file.attachment_url) {
                    await imageRemover("communities", file.attachment_url);
                }
            }
        }

        // Step 3: Delete DB records
        const { error: deleteError } = await supabaseClient
            .rpc("delete_community_records", { p_community_id: communityID });

        if (deleteError) {
            throw new ErrorHandler(`Failed to delete community DB records: ${deleteError.message}`, 500);
        }

        return {
            success: true,
            message: `Community ${communityID} and all associated content have been deleted successfully.`
        };
    } catch (err) {
        if (err instanceof ErrorHandler) throw err;
        throw new ErrorHandler(err.message || "Failed to delete community", 500);
    }
}

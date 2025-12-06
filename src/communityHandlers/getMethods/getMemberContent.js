import { ErrorHandler } from "../../objects/errorHandler.js";
/**
 * Fetches all content (posts and announcements) for a specific member in a community.
 * This includes both the original attachment URLs and public URLs,
 * which can be used for file cleanup in Supabase Storage.
 *
 * @param {string} userID - UUID of the member
 * @param {number} communityID - ID of the community
 * @param {object} supabaseClient - Supabase client instance
 * @returns {Promise<Array>} - Array of objects containing content_type, content_id, attachment_url, public_url
 * @throws {ErrorHandler} - Throws an error if the fetch fails
 */
export async function getMemberContent(userID, communityID, supabaseClient) {
    const { data, error } = await supabaseClient
        .rpc("get_member_content_for_cleanup", {
            p_member_id: userID,
            p_community_id: communityID
        });

    if (error) {
        throw new ErrorHandler(`Failed to fetch member content: ${error.message}`, 500);
    }

    // Return the array of posts and announcements
    return data || [];
}
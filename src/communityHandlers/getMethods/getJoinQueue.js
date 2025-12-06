import { ErrorHandler } from "../../objects/errorHandler.js";

export async function getJoinQueue (userID, communityID, supabaseClient) {
    // Retrieve the join queue
    const { data: joinQueue, error: retrievalError } = await supabaseClient.rpc('get_community_join_queue', {
        p_requesting_user_id: userID,
        p_target_community_id: communityID
    });

    if (retrievalError) {
        throw new ErrorHandler("Failed to retrieve the join queue. Please try again.", 500);
    }

    // Supabase returns null if the function returns 0 rows, so ensure we always return an array
    const safeQueue = joinQueue ?? [];

    // Return consistent structure
    return { joinQueue: safeQueue, success: true, message: 'Join queue retrieved successfully.' };
}
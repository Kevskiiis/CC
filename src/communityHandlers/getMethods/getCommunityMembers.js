import { ErrorHandler } from "../../objects/errorHandler.js";

export async function getCommunityMembers (userID, communityID, supabaseClient) {
    // Retrieve the join queue
    const { data: members, error: retrievalError } = await supabaseClient.rpc('get_community_members', {
        p_member_id: userID,
        p_community_id: communityID
    });

    if (retrievalError) {
        throw new ErrorHandler("Failed to retrieve members in the community. Refresh to try again.", 500);
    }

    // Supabase returns null if the function returns 0 rows, so ensure we always return an array
    if (members.length == 0) {
        return { members: [], success: true, message: 'There are no members in your community. Tell your friends and colleagues to join to start chatting!'};
    }
    // Return consistent structure
    const safeMembers = members ?? [];
    return { members: safeMembers, success: true, message: 'Members retrieved successfully.' };
}
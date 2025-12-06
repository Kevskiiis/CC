import { ErrorHandler } from "../../objects/errorHandler.js";

export async function approveCommunityJoinRequest (newUserID, communityID, supabaseClient) {
    // Allow the new user inside the community: 
    const { data, error } = await supabaseClient.rpc('approve_join_request', {
        p_new_user_id: newUserID,
        p_community_id: communityID
    });

    // Handle Error:
    if (error) {
        throw new ErrorHandler("Database error occured while approving the request. Please try again.", 500);
    }

    // Handle some of the edge cases: s
    if (data === "already_member") {
        throw new ErrorHandler("User is already a member of this community.", 400);
    }

    if (data === "no_request_found") {
        throw new ErrorHandler("No request was found for the user.", 400);
    }

    // Return sucessful message:
    return {
        result: data,
        approved: true
    }
}
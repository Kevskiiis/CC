import { ErrorHandler } from "../objects/errorHandler.js";

export async function isUserAnAdmin (userID, communityID, supabaseClient) {
    const {data, error} = await supabaseClient.rpc('is_user_admin', {p_user_id: userID, p_community_id: communityID});

    if (error) {
        throw new ErrorHandler("There was an error verifying if you are authorized to make this action. Please try again.", 500);
    }
    // Returns a boolean:
    return data;
}
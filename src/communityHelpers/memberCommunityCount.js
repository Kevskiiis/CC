import { ErrorHandler } from "../objects/errorHandler.js";

export async function memberCommunityCount (userID, communityID, supabaseClient) {
    // Try to get the community count by calling the Supabase SQL function which excludes member calling it: 
    const {data: count, error: functionError} = await supabaseClient.rpc('get_community_member_count', {p_community_id: communityID, p_member_id: userID});

    if (functionError) {
        throw new ErrorHandler("We could not retrieve community information to complete an action at this time. Please try again.", 500); 
    }

    // Return count: 
    return {
        success: true,
        count: count
    }  
}

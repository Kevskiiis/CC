import { ErrorHandler } from "../objects/errorHandler.js";

export async function adminCommunityCount (userID, communityID, supabaseClient) {
    // Try to get the community count by calling the Supabase SQL function which excludes member calling it: 
    const {data: count, error: functionError} = await supabaseClient.rpc('get_admin_count_excluding_member', {community_id: communityID, member_id: userID});

    if (functionError) {
        throw new ErrorHandler("We could not retrieve community information to complete an action at this time. Please try again.", 500); 
    }

    // Return count: 
    return {
        success: true,
        count: count
    }  
}

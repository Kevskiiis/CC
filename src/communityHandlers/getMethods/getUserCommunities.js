import { ErrorHandler } from "../../objects/errorHandler.js";
import { getImagePublicUrl } from "../../imageHandlers/imagePublicURL.js";

export async function getUserCommunities (userID, supabaseClient) {
    // Call the supabase function:
    const {data, error} = await supabaseClient.rpc('get_user_communities', { p_user_id: userID });

    // Analyze if the data exists:
    if (error) {
        throw new ErrorHandler("Error occured while fetching your communities. Try to refresh again.", 500);
    }

    // User belongs to no communities
    if (!data || data.length === 0) {
        return {
            success: true, 
            message: 'No communities currently. Join a community now!',
            communities: []
        }
    }

    // Handle the case where data is present: 
    return {
        success: true, 
        message: 'Here are your communities!',
        communities: data
    }
}
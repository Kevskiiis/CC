import { ErrorHandler } from "../../objects/errorHandler.js";
import { getMemberContent } from "../../communityHandlers/getMethods/getMemberContent.js";
import { deleteMemberContent } from "../../communityHandlers/deleteMethods/deleteMemberContent.js";


export async function leaveCommunity (userID, communityID, supabaseClient) {
    // Get all of their content, pictures, etc.
    const memberContent = await getMemberContent(userID, communityID, supabaseClient);

    // Delete all of their content, pictures, etc.
    const deletedContent = await deleteMemberContent(memberContent, "communities"); 

    const { data, error } = await supabaseClient.rpc('remove_member_from_community', {
        p_community_id: communityID,
        p_member_id: userID
    })

    // If error: 
    if (error) {
        throw new ErrorHandler("Error attempting to remove you from the community. Please try again.", 500);
    }

    return {
        success: true,
        message: data
    }
} 
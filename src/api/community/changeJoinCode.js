import { getSupabaseUserClient } from "../supabase/localSupabaseClient.js";
import { generateCommunityCode } from "../../../utils/CommunityFunctions.js";

export async function changeJoinCode (communityID, bearerToken) {
    // Create Instance of the supbase client:
    const supabaseUser = await getSupabaseUserClient(bearerToken);
    
    // Catch the user and the data:
    const { data: { user }, error: UserError } = await supabaseUser.auth.getUser();
    
    // Generate the new code:
    const newJoinCode = await generateCommunityCode();

    // Call SQL function to change the code: 
    const { data, error } = await supabaseUser.rpc('update_community_join_code', {
        p_community_id: communityID,
        p_new_join_code: newJoinCode
    });

    if (error) {
        return {
            success: false,
            message: 'New token failed to insert.'
        }
    }

    return {
        success: true,
        message: `New token for the community was successful inserted: ${newJoinCode}`
    }
}   
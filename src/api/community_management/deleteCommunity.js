import { getSupabaseUserClient } from "../supabase/localSupabaseClient";

export async function deleteCommunity (communityID, bearerToken) {
    // Create a superbase object: 
    const supabaseUser = await getSupabaseUserClient(bearerToken);

    // Catch the user and the data:
    const { data: { user } } = await supabaseUser.auth.getUser();

    // Attempt to delete the community:
    const {data, error} = supabaseUser
    .from('communities')
    .delete()
    .match({community_id: communityID});

    // Catch error:
    if (error) {
        return {
            success: false,
            message: 'The community failed to delete'
        }
    }
    
    return {
        success: true, 
        message: 'The community deleted successfully.'
    }
}
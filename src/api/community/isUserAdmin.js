import { getSupabaseUserClient } from "../supabase/localSupabaseClient.js";

export async function isUserAdmin (communityID, bearerToken) {
    try {
        // Create Instance of the supbase client:
        const supabaseUser = await getSupabaseUserClient(bearerToken);

        // Catch the user and the data:
        const { data: { user }, error: UserError } = await supabaseUser.auth.getUser();

        // console.log(user.id); 
        
        // Call SQL function:
        const {data, error} = await supabaseUser.rpc('is_user_admin', {p_user_id: user.id, p_community_id: communityID});

        // console.log(data);

        if (error) {
            return false;
        }

        return data;
    }
    catch (error) {

    }
}
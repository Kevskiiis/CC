import { getSupabaseUserClient } from "../supabase/localSupabaseClient.js";
import { isUserAdmin } from "../community/isUserAdmin.js";

export async function approveJoinRequest (newUserID, communityID, adminBearerToken) {
    try {
        // Create Instance of the supbase client:
        const supabaseUser = await getSupabaseUserClient(adminBearerToken);

        // Catch the user and the data:
        const { data: { user }, error: UserError } = await supabaseUser.auth.getUser();
        
        // Check if the approver is an admin: 
        const isAdmin = await isUserAdmin(communityID, adminBearerToken);

        // If so, then allow the new user inside the community: 
        if (isAdmin) {
            const { data, error } = await supabaseUser.rpc('approve_join_request', {
                p_new_user_id: newUserID,
                p_community_id: communityID
            });

            if (error) {
                return {
                    result: error,
                    approved: false
                }
            }

            return {
                result: data,
                approved: true
            }
        }
        else {
            return {
                result: 'You are not authorized to make this request.',
                approved: false
            }
        }
    }
    catch (error) {

    }
}
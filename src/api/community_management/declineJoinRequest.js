import { getSupabaseUserClient } from "../supabase/localSupabaseClient.js";
import { isUserAdmin } from "../community/isUserAdmin.js";

export async function declineJoinRequest (userID, communityID, adminBearerToken) {
    try {
        // Create Instance of the supbase client:
        const supabaseUser = await getSupabaseUserClient(adminBearerToken);
        
        // Check if the approver is an admin: 
        const isAdmin = await isUserAdmin(communityID, adminBearerToken);

        // If so, then allow the new user inside the community: 
        if (isAdmin) {
            const { data, error } = await supabaseUser.rpc('decline_join_request', {
                p_user_id: userID,
                p_community_id: communityID
            });

            if (error) {
                return {
                    declined: false,
                    result: error.message || 'Database error occurred.'
                };
            }

            // data is now a JSON object from the RPC
            if (data && data.success) {
                return {
                    declined: true,
                    result: data.message
                };
            }

            return {
                declined: false,
                result: data?.message || 'Failed to decline the join request.'
            };
        }
        else {
            return {
                declined: false,
                result: 'You are not authorized to make this request.'
            };
        }
    }
    catch (error) {
        console.error('Error in declineJoinRequest:', error);
        return {
            declined: false,
            result: error.message || 'An unexpected error occurred while declining the request.'
        };
    }
}
import { getSupabaseUserClient } from "../supabase/localSupabaseClient.js";

export async function joinCommunity (userID, communityCode, supabaseClient) {
    try {
        const { data, error } = await supabaseClient.rpc(
            'request_to_join_community',
            { p_profile_id: userID, p_join_code: communityCode }
        );

        if (error) {
            console.error('Join community error:', error);
            return { success: false, message: error };
        }

        if (data === "success") {
            return { success: true, message: 'Nice! Now one the community members will have to approve!'};
        }
        else {
            return { success: false, message: "Community code error: " + data};
        }

    }   
    catch (error) {
        // console.log('Unexpected error:', error);
        return { success: false, message: error.message };
    }
}
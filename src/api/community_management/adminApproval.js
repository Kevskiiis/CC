import { getSupabaseUserClient } from "../supabase/localSupabaseClient";

export async function adminApproval (communityID, bearerToken, newAdminID) {
    const supabaseUser = getSupabaseUserClient(bearerToken);

    // Make a new admin:
    const { data, error } = await supabaseUser.rpc(
        'set_member_role_admin', 
        { community_id: communityID, member_id: newAdminID }
    );

    if (error) {
        console.error('Error promoting member:', error);
        return { success: false };
    }

    return { success: true };
}   
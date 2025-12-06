import { getSupabaseUserClient } from "../supabase/localSupabaseClient";


export async function communityRole (memberID, bearerToken) {
    try {
        // Create the client:
        const supabaseUser = getSupabaseUserClient(bearerToken); 

        // Extract the client role:
        const { data, error } = await supabaseUser
        .from('community_members')
        .select('role_name')
        .eq('member_id', memberID);

        if (error) {
            return false;
        } 
        else if (data.length > 0) {
            const roleName = data[0].role_name; // first role
            return roleName;

        } 
        else {
            return false;
        }
    }
    catch (error) {
        
    }
}
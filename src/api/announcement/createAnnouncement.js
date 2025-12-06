import { getSupabaseUserClient } from "../supabase/localSupabaseClient.js";
import { isUserInThisCommunity } from "../community/isUserInThisCommunity.js";

export async function createAnnouncement (communityID, announcementTitle, announcementDescription, attachment64, announcementRole, bearerToken) {
    try {
        // Create an instance of the Supabase client for a user: 
        const supabaseUser = await getSupabaseUserClient(bearerToken);
    
        // Catch the user and the data:
        const { data: { user } } = await supabaseUser.auth.getUser();

        // Verify that the user is in the community:
        const userInCommunityResult = await isUserInThisCommunity(communityID, bearerToken);
    
        if (userInCommunityResult.success) {
            const {data, error} = await supabaseUser
            .from('community_announcements')
            .insert([{
                community_id: communityID,
                profile_id: user.id,
                announcement_title: announcementTitle,
                announcement_description: announcementDescription,
                attachment_url: attachment64,
                announcement_role: announcementRole,
                date_announced: new Date().toISOString()
            }]);
    
            if (error) {
                return {
                    success: false,
                    message: 'Failed to insert into the SQL table.'
                }
            }
    
            return {
                success: true,
                message: 'Announcement was successfully posted!'
            }
        }
        else {
            return {
                success: false,
                message: 'You do not belong to this community.'
            }
        }
    }
    catch (error) {
        return {
            success: false,
            message: 'Unexpected error occured while trying to create an announcement.'
        }
    }
}
import { ErrorHandler } from "../../objects/errorHandler.js";

export async function getCommunityAnnouncements(userID, communityID, supabaseClient) {
    const { data: announcements, error: retrievalError } = await supabaseClient
        .from('community_announcements')
        .select(`
            announcement_id,
            community_id,
            profile_id,
            announcement_title,
            announcement_description,
            announcement_public_url,
            attachment_url,
            created_at,
            profiles:profiles!community_announcements_profile_id_fkey(
                display_name,
                avatar_public_url
            )
        `)
        .eq('community_id', communityID)
        .order('created_at', { ascending: false });

    if (retrievalError) {
        throw new ErrorHandler("Announcement retrieval error. Refresh the page to try again.", 500);
    }

    const safeAnnouncements = announcements ?? [];

    return { announcements: safeAnnouncements, success: true, message: 'Successful!' };
}

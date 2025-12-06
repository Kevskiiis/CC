import { ErrorHandler } from "../../objects/errorHandler.js";

export async function getCommunityPosts (userID, communityID, supabaseClient) {
    // Try direct select with profile join to include author name/avatar
    const { data: posts, error: retrievalError } = await supabaseClient
        .from('community_posts')
        .select(`
            post_id,
            community_id,
            profile_id,
            post_title,
            post_description,
            post_public_url,
            attachment_url,
            created_at,
            profiles:profiles!community_posts_profile_id_fkey(
                display_name,
                avatar_public_url
            )
        `)
        .eq('community_id', communityID)
        .order('created_at', { ascending: false });

    if (retrievalError) {
        throw new ErrorHandler("Post retrieval error. Refresh the page to try again.", 500);
    }

    const safePosts = posts ?? [];

    return { posts: safePosts, success: true, messsage: 'Posts retrieved successfully!'};
}

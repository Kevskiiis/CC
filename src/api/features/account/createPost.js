import { getSupabaseUserClient } from "../../supabase/localSupabaseClient.js";


export async function createPost (communityID, profileID, postTitle, postDescription, attachment64) {
  try {
    const { data, error } = await supabase
    .from('community_posts')
    .insert([{
      community_id: Number(communityID),
      profile_id: profileID,
      post_title: postTitle,
      post_description: postDescription,
      attachment_url: attachment64
    }])
    .select()

    if (!error) {
      return {
        success: true,
        data: data
      }
    }

    return {
      success: false,
      data: null
    }
  }
  catch (error) {
    return {
      success: false,
      data: null
    }
  }
}
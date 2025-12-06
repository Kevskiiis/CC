import { ErrorHandler } from "../../objects/errorHandler.js";
import { imageUploader } from "../../imageHandlers/imageUploader.js";
import { imageRemover } from "../../imageHandlers/imageRemover.js";
import { getImagePublicUrl } from "../../imageHandlers/imagePublicURL.js";

export async function createPost (communityID, communityName, profileID, postTitle, postDescription, postImage = null, supabaseClient) {
    //Step 1: Insert new community post: 
    const { data: postData, error: postError } = await supabaseClient
    .from('community_posts')
    .insert([{
        community_id: Number(communityID),
        profile_id: profileID,
        post_title: postTitle,
        post_description: postDescription,
        attachment_url: null
    }])
    .select();
    // console.log(postError);
    if (postError) {
        throw new ErrorHandler("Error uploading a community post. Try again.", 500);
    }

    const post = postData[0];

    // If a file was intended to be intered and it fails to upload, handle:
    const filePath = postImage != null ? `${communityName.toLowerCase().trim()}/community_post_images/${post.post_id}-${postImage.originalname}` : null;
    if (filePath !== null) {
        await imageUploader("communities",filePath, postImage);
    }

    const getPublicURL = await getImagePublicUrl("communities", filePath);

    // Upload Image URL into the community posts:
    const { data: urlData, error: urlError } = await supabaseClient
    .from('community_posts')
    .update({
        attachment_url: filePath,
        post_public_url: getPublicURL.success = true ? getPublicURL.url : null
    })
    .eq("post_id", post.post_id)
    .select();

    if (urlError) {
        await imageRemover("communities", filePath);
        throw new ErrorHandler("There was an error updating the url data.")
    }

    return {
        success: true,
        post: post
    }
}
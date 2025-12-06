import { ErrorHandler } from "../../objects/errorHandler.js";
import { imageRemover } from "../../imageHandlers/imageRemover.js";
import { imageUploader } from "../../imageHandlers/imageUploader.js";
import { getImagePublicUrl } from "../../imageHandlers/imagePublicURL.js";

export async function updateProfilePicture (userID, imageFile, supabaseClient) {
    // Get the user account url details: 
    const { data, error } = await supabaseClient.rpc("get_own_avatar_urls");

    if (error) throw new ErrorHandler("The call failed to retrieve old data to update it> Please try again.", 500); 

    // Collect the data:
    const userURLs = data[0]; 

    // Handle the case where url's not null:
    if (userURLs.avatar_url && userURLs.avatar_public_url) {
        // Delete the old picture: 
        const removedResult = await imageRemover("profiles", userURLs.avatar_url);

        if (!removedResult.success) throw new ErrorHandler("The call failed to remove the old image. Please try again."); 

        // Create the new bucket file path: 
        const filePath = imageFile != null ? `${userID.trim()}/profile_avatar/${imageFile.originalname.trim()}` : null;
        if (filePath !== null) {
            await imageUploader("profiles", filePath, imageFile);
        }
        // Create the new public url: 
        const publicURL = await getImagePublicUrl("profiles", filePath);


        // Call update function if everything goes well.
        const { data: supbaseResponse, error: updateError } = await supabaseClient.rpc("update_user_avatar", {
            p_avatar_url: filePath,
            p_avatar_public_url: publicURL.url
        })

        if (updateError) throw new ErrorHandler("There was an error uploading the new image. Please try again.", 500); 

        // Return success:
        return {
            success: true,
            message: supbaseResponse,
            newImageUrl: publicURL.url
        }
    }
    else {
        // Create the new bucket file path: 
        const filePath = imageFile != null ? `${userID.trim()}/profile_avatar/${imageFile.originalname.trim()}` : null;
        if (filePath !== null) {
            await imageUploader("profiles", filePath, imageFile);
        }
        // Create the new public url:
        const publicURL = await getImagePublicUrl("profiles", filePath);


        // Call update function if everything goes well.
        const { data: supbaseResponse, error: updateError } = await supabaseClient.rpc("update_user_avatar", {
            p_avatar_url: filePath,
            p_avatar_public_url: publicURL.url
        })

        if (updateError) throw new ErrorHandler("There was an error uploading the new image. Please try again.", 500); 

        return {
            success: true,
            message: supbaseResponse,
            newImageUrl: publicURL.url
        }
    }
}
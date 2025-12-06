import { ErrorHandler } from "../../objects/errorHandler.js";

export async function updateBio (newBio, supabaseClient) {
    const { data, error } = await supabaseClient.rpc("update_own_bio", {
        new_bio: newBio
    })

    if (error) throw new ErrorHandler("Failed to update your bio at this time. Please try again.", 500);

    return {
        success: true, 
        message: "Bio was successfully updated!",
        newBio: data
    }
} 
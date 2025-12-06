import { supabase } from "../api/supabase/globalSupabaseClient.js";
import { ErrorHandler } from "../objects/errorHandler.js";
import { imageUploader } from "../imageHandlers/imageUploader.js";
import { getImagePublicUrl } from "../imageHandlers/imagePublicURL.js";

// CREATE ACCOUNT:
export async function createAccount (trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPassword, avatarImage = null) {
    // Upload user to Auth Table:
    const {data: AuthData, error: AuthError} = await supabase.auth.signUp({
        email: trimmedEmail, 
        password: trimmedPassword, 
        options: {
        data: {display_name: `${trimmedFirstName} ${trimmedLastName}`}
        }
    });

    // If Auth Upload Fails:
    if (AuthError) throw new ErrorHandler(AuthError.message, 500);

    // If successful in sign-up, obtain the user's id:
    const userID = AuthData.user.id;

    // Upload Image: 
    const filePath = avatarImage != null ? `${userID.trim()}/profile_avatar/${avatarImage.originalname}` : null;
    if (filePath !== null) {
        await imageUploader("profiles",filePath, avatarImage);
    }

    const getPublicURL = await getImagePublicUrl("profiles", filePath);

    // Upload user to the Profiles Table:
    const {data: ProfileData, error: ProfileError} = await supabase
    .from('profiles')
    .insert([{
        profile_id: userID,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        avatar_url: filePath,
        avatar_public_url: getPublicURL.success = true ? getPublicURL.url : null
    }])
    .select();

    // If Profile upload fails: 
    if (ProfileError) {
        await supabase.auth.admin.deleteUser(userID);
        throw new ErrorHandler("Failed to save profile data into the database.", 500);
    }


    // Success:
    return {
        success: true,
        message: "Account successfully created! You must sign-in now.",
        profile: ProfileData[0],
    };  
}
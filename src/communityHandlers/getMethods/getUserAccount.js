import { ErrorHandler } from "../../objects/errorHandler.js";

export async function getUserAccount (userID, supabaseClient) {
    const { data, error } = await supabaseClient.rpc("get_user_profile_info", {
        p_profile_id: userID
    });

    console.log(userID);

    // Handle Supabase Server Error:
    if (error) throw new ErrorHandler(`There was an error retrieving your account: ${error.message}`, 500); 

    // Handle:
    const dataObject = data?.[0] ?? null;

    if (dataObject === null) {
        return {
            success: false,
            message: "There was an error retrieving your account. Try refreshing the page",
            userObject: null
        }
    }

    return {
        success: false,
        message: "Account retrival was successful!",
        userObject: dataObject
    }
}
import { ErrorHandler } from "../../objects/errorHandler.js";

export async function joinCommunity (userID, communityCode, supabaseClient) {
    const { data, error } = await supabaseClient.rpc(
        'request_to_join_community',
        { p_profile_id: userID, p_join_code: communityCode }
    );
    // Supabase error:
    if (error) {
        throw new ErrorHandler("There was an error with the server when attempting to join. Try again.", 500);
    }

    // Unsuccessful request, either the user is already in the community or code is incorrect:
    if (data !== "success") {
        throw new ErrorHandler("You have already requested to join the community, or you entered the code incorrectly.", 401);
    }

    // Successful request sent: 
    if (data === "success") {
        return { success: true, message: 'Nice! Now one the community admin members will have to approve your request!'};
    }
}
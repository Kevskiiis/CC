import { ErrorHandler } from "../objects/errorHandler.js";

export async function isUserInThisCommunity (userID, communityID, supabaseClient) {
    // Call the SQL function to check:
    const {data: Table, error: TableError } = await supabaseClient.rpc('is_user_in_community_v3', {p_community_id: communityID, p_user_id: userID});

    // Catch TableError:
    if (TableError) {
        throw new ErrorHandler("Error occured while verifying your community status.", 500);
    }

    // Obtain boolean value from the SQL call:
    const isInCommunity = Table?.[0]?.in_community ?? false;

    // Return if they are part of the community:
    if (isInCommunity) {
        return {
            success: true,
            message: 'User is present in the community!'
        }
    }
    else {
        return {
            success: false,
            message: 'User is not present in the community. You are not authorized to make no decisions.'
        }
    }
}
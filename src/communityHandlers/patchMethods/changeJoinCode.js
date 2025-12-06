import { generateCommunityCode } from "../../../utils/CommunityFunctions.js";
import { ErrorHandler } from "../../objects/errorHandler.js";

export async function changeJoinCode (communityID, supabaseClient) {
    // Generate community code with retry logic:
    let joinCode;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        joinCode = await generateCommunityCode();

        const { data: JoinCodeData, error: JoinCodeError } = await supabaseClient
            .from('communities')
            .select('join_code')
            .eq('join_code', joinCode)
            .limit(1);

        if (JoinCodeError) {
            throw new ErrorHandler("Error checking if a join code already exists. Try again.", 500); 
        }

        if (JoinCodeData?.length === 0) {
            break;
        }

        attempts++;
        
        if (attempts >= maxAttempts) {
            throw new ErrorHandler("Could not generate a unique join code. Please try again.", 500); 
        }
    }

    // Call SQL function to change the code: 
    const { data, error } = await supabaseClient.rpc('update_community_join_code', {
        p_community_id: communityID,
        p_new_join_code: joinCode
    });

    if (error) {
        throw new ErrorHandler("New community code failed insert.", 500);
    }

    return {
        success: true,
        message: `New token for the community was successful inserted: ${joinCode}`
    }
}   
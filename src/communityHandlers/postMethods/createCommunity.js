import { generateCommunityCode } from "../../../utils/CommunityFunctions.js";
import { ErrorHandler } from "../../objects/errorHandler.js";
import { imageUploader } from "../../imageHandlers/imageUploader.js";
import { imageRemover } from "../../imageHandlers/imageRemover.js";
import { getImagePublicUrl } from "../../imageHandlers/imagePublicURL.js";

export async function createCommunity(communityName, communityBio = null, communityImage = null, userID, supabaseClient) {
    // Validate inputs:
    if (!communityName?.trim()) {
        throw new ErrorHandler("You must enter a community name to create one.", 400); 
    }

    // Check if there is a client:
    if (!supabaseClient) {
        throw new ErrorHandler("You must be signed-in to create a community.", 401); 
    }

    // Check if the community name already exists:
    const { data: CommunityCheckData, error: CommunityCheckError } = await supabaseClient
      .from('communities')
      .select('community_name')
      .eq('community_name', communityName)
      .limit(1);

    // Error with community check: 
    if (CommunityCheckError) {
        throw new ErrorHandler("Failed to verify the community name availability.", 500);
    }
    // Error if the name entered already exists: 
    if (CommunityCheckData?.length > 0) {
        throw new ErrorHandler("Community with this name already exists.", 401); 
    }

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
    
    // If a file was intended to be intered and it fails to upload, handle:
    const filePath = communityImage != null ? `${communityName.toLowerCase()}/communityimage/${communityImage.originalname}` : null;
    if (filePath !== null) {
        await imageUploader("communities",filePath, communityImage);
    }

    const getPublicURL = await getImagePublicUrl("communities", filePath); 

    // Call the database function (atomic transaction)
    const { data: CommunityData, error: CommunityError } = await supabaseClient
        .rpc('create_community_with_creator', {
            p_community_name: communityName,
            p_community_bio: communityBio,
            p_attachment_url: filePath,
            p_community_public_url: getPublicURL.success = true ? getPublicURL.url : null,
            p_join_code: joinCode,
            p_user_id: userID
        });

    if (CommunityError) {
        await imageRemover("communities", filePath);
        throw new ErrorHandler("Error creating community.", 500);
    }

    if (!CommunityData || CommunityData.length === 0) {
        throw new ErrorHandler("Failed to retrieve community data after creation.", 500);
    }

    // The function returns an array with one row
    const community = CommunityData[0];

    // Success:
    return {
        success: true,
        message: 'Community created successfully!',
        community: {
            id: community.community_id,
            name: community.community_name,
            bio: community.community_bio,
            joinCode: community.join_code,
            attachmentUrl: community.attachment_url,
            publicUrl: community.community_public_url,
            dateCreated: community.date_created
        }
    };
}
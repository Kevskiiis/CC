// NPM Packages: 
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';

// Imported functions:
import { validateNewAccount } from '../utils/authValidator.js';
import { 
    createNewAccount, 
    // signIn, 
    // signOut, 
    refreshSession, 
    // createCommunity,
    getCommunities,
    isUserInCommunity,
    // createPost
} from '../utils/supabaseFuntions.js';

// import { createAnnouncement } from './api/announcement/createAnnouncement.js';
// import { joinCommunity } from './api/community_management/joinCommunity.js';
import { approveJoinRequest } from './api/community_management/approveJoinRequest.js';
import { declineJoinRequest } from './api/community_management/declineJoinRequest.js';
// import { getUserCommunities } from './communityHandlers/getMethods/getUserCommunities.js';
import { getCommunityPosts } from './communityHandlers/getMethods/getCommunityPosts.js';
import { getCommunityAnnouncements } from './api/announcement/getCommunityAnnouncements.js';
// import { getJoinQueue } from './communityHandlers/getMethods/getJoinQueue.js';
import { isUserInThisCommunity } from './communityHelpers/isUserInThisCommunity.js';
import { isUserAdmin } from './api/community/isUserAdmin.js';
// import { changeJoinCode } from './api/community/changeJoinCode.js';
// import { getCommunityMembers } from './communityHandlers/getMethods/getCommunityMembers.js';
// import { adminCommunityCount } from './communityHelpers/adminCommunityCount.js';
import { leaveCommunity } from './api/community_management/leaveCommunity.js';

// -------------------------------------------------------------------------------------------
// Authentication Handler Functions:
import { createAccount } from './authenticationHandlers/createAccount.js';
import { signIn } from './authenticationHandlers/signIn.js';
import { signOut } from './authenticationHandlers/signOut.js';
import { restoreSession } from './authenticationHandlers/restoreSession.js';

// Community Handler Functions:
import { getUserAccount } from './communityHandlers/getMethods/getUserAccount.js';
import { getUserCommunities } from './communityHandlers/getMethods/getUserCommunities.js';
import { getCommunityMembers } from './communityHandlers/getMethods/getCommunityMembers.js';
import { getJoinQueue } from './communityHandlers/getMethods/getJoinQueue.js';
import { createCommunity } from './communityHandlers/postMethods/createCommunity.js';
import { joinCommunity } from './communityHandlers/postMethods/joinCommunity.js';
import { approveCommunityJoinRequest } from './communityHandlers/postMethods/approveCommunityJoinRequest.js';
import { createPost } from './communityHandlers/postMethods/createPost.js';
import { createAnnouncement } from './communityHandlers/postMethods/createAnnouncement.js';
import { deleteCommunity } from './communityHandlers/deleteMethods/deleteCommunity.js';
import { changeJoinCode } from './communityHandlers/patchMethods/changeJoinCode.js';
import { updateBio } from './communityHandlers/patchMethods/updateBio.js';
import { updateProfilePicture } from './communityHandlers/patchMethods/updateProfilePicture.js';

// Community Helper Functions:
import { isUserAnAdmin } from './communityHelpers/isUserAnAdmin.js';
import { adminCommunityCount } from './communityHelpers/adminCommunityCount.js';
import { memberCommunityCount } from './communityHelpers/memberCommunityCount.js';

// Image Handler Functions:
import { imageUploader } from './imageHandlers/imageUploader.js';


// Helper Functions:
import { trimStrings } from './helpers/strings/trimStrings.js';


// Objects:
import { ErrorHandler } from './objects/errorHandler.js';
import authMiddleware from './middleware/authMiddleware.js';

// Enviroment Variables:
dotenv.config({path: '../.env'});

// Start server & intialize port number:
const server = express();
const PORT = process.env.PORT || 3000;

// Middleware:
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Store uploaded files in memory instead of disk:
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET Methods:
server.get('/get-own-account', authMiddleware, async(req, res) => {
    try {
        console.log(req.user.id);
        const result = await getUserAccount(req.user.id, req.supabase);
        res.status(200).json(result); 
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'An unexpected error occured.',
        })
    }
});

server.get('/get-user-communities', authMiddleware, async(req, res) => { // Finalized
    try {
        // Aquire Supabase Client and User from AuthMiddleware + Fetch Communities: 
        const result = await getUserCommunities(req.user.id, req.supabase);
        res.status(200).json(result); 
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'An unexpected error occured.',
        })
    }
});

server.get('/get-community-members', authMiddleware, async(req, res) => { // Finalized
    try {
        // Get Query Param: Community ID
        const { communityID } = req.query;

        if (!communityID) {
            throw new ErrorHandler("There is missing information that is required to complete your call.", 401);
        }

        // Attempt to retrieve members: 
        const result = await getCommunityMembers(req.user.id, communityID, req.supabase);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'An unexpected error occured.',
        })
    }
});

server.get('/get-community-posts', authMiddleware, async (req, res) => { // Finalized: Needs time function.
    try {
        // Get query params
        const { communityID } = req.query;
        
        if (!communityID) {
            throw new ErrorHandler("There is missing information that is required to complete your call.", 401);
        }

        const isUserInCommunity = await isUserInThisCommunity(req.user.id, communityID, req.supabase);

        // Use the function to get posts:
        if (isUserInCommunity.success) {
            const result = await getCommunityPosts(req.user.id, communityID, req.supabase);
    
            // Return posts
            return res.status(200).json(result);
        }
        else {
            return res.status(401).json({
                message: 'Not authorized to load the posts from this community.',
                communityPosts: null
            })
        }
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.get('/get-community-announcements', authMiddleware, async (req, res) => { // Finalized: Needs time function": 
    try { 
        const { communityID } = req.query;
        if (!communityID) {
            throw new ErrorHandler("Required information was not entered. Please try again.", 401);
        }

        // Check if user is a member of this community
        const isUserInCommunity = await isUserInThisCommunity(req.user.id, communityID, req.supabase);

        if (isUserInCommunity.success) {
            // Use the function to get announcements
            const result = await getCommunityAnnouncements(req.user.id, communityID, req.supabase);

            // Return announcements
            return res.status(200).json(result);
        }
        else {
            return res.status(401).json({
                message: 'Not authorized to load the announcements from this community.',
                communityAnnouncements: null
            });
        }
    } 
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.get('/get-community-join-queue', authMiddleware, async (req, res) => { // Finalized
    try {
       // Query Params
       const { communityID } = req.query;

       // Check if the user is an admin: 
       const isAdmin = await isUserAnAdmin(req.user.id, communityID, req.supabase);

       // If the user is not an admin: 
       if (isAdmin) {
            const queue = await getJoinQueue(req.user.id, communityID, req.supabase);
            return res.status(200).json(queue); 
       }
       else {
            return res.status(401).json({
                success: false,
                message: 'Unathorized to get join queue.', 
                queue: null
            })
       }
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

// POST Methods: 
server.post('/sign-in', async (req, res) => { // Finalized:
    try {
        // Obtain the form body:
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ErrorHandler("Missing required fields.", 400);
        }

        // Trim any trailing spaces in the inputs: 
        const [trimmedEmail, trimmedPassword] = trimStrings([email, password]);

        // Attempt to sign-in via Supabase:
        const result = await signIn(trimmedEmail, trimmedPassword);

        // Return data if successful:
        return res.status(200).json(result); 
    } 
    catch (err) {
        console.log(err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        })
    }
});

server.post('/sign-out', async (req, res) => { // Finalized but requires testing! Maybe Add Auth Middleware 
    try {
        // Accept tokens to kill the session attached to them:
        const accessToken = req.headers.authorization.replace(/^Bearer\s+/i, ''); 
        const refreshToken = req.headers["refreshtoken"]; 
        // Handle edge case where the required tokens are not entered:
        if (!accessToken || !refreshToken) throw new ErrorHandler("There is missing data that is required to sign-out. Please try again.");
        
        // Call the sign out function to complete the task: 
        const result = await signOut(accessToken, refreshToken);
        // Return the result:
        return res.status(200).json(result); 
    }
    catch (err) { // Handling & Catching Errors here:
        return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || 'An unexpected error occurred with the server.'
        })
    }
});

server.post('/create-account', upload.single("avatarImage"), async (req, res) => { // Temp Finlized Fix Error Handling
    try {
        // Obtain all the features that we need from middleware: 
        const { firstName, lastName, email, password } = req.body;
        const avatarImage = req.file;

        // Handle if one the fields is missing:
        if (!firstName || !lastName || !email || !password) {
            throw new ErrorHandler("Missing required fields.", 400);
        }

        // Trim the inputs from trailing white spaces:
        const [trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPassword] = trimStrings([firstName, lastName, email, password]);
        
        // Validate new account first: function throws Errors if not valid for the catch block to handle.
        await validateNewAccount(trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPassword);

        // Create new account: 
        const result = await createAccount(trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPassword, avatarImage);

        // Account was successfully create:
        return res.status(200).json(result);
    } 
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'An unexpected error occurred with the server.'
        })
    }
});

server.post('/restore-session', async (req, res) => { // Finalized: Maybe Add Auth Middleware
    try {
        // Accept refresh token in order to refresh the session:
        const refreshToken = req.headers["refreshtoken"];
        
        // Handle in case the refresh token is not provided:
        if (!refreshToken) throw new ErrorHandler("There is missing data that is required to restore session.", 400);

        // Attempt to restore the session: 
        const result = await restoreSession(refreshToken);
        
        // Return results:
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'An unexpected error occurred with the server.'
        })
    }
});

server.post('/create-community', authMiddleware, upload.single("communityImage"), async (req, res) => { // Finalized + A little more testing.
    try {
        // Collect the client & user:
        const supabaseClient = req.supabase; 
        const user = req.user;

        // Collect the send over image: 
        const communityImage = req.file;
        const { communityName, communityBio} = req.body;
        const [trimmedCommunityName, trimmedCommunityBio] = trimStrings([communityName, communityBio]);

        // Create new community: 
        const result = await createCommunity(trimmedCommunityName, trimmedCommunityBio, communityImage, user.id, supabaseClient);

        // If creation is successful, then return the result:
        return res.status(200).json(result); 
    } 
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'An unexpected error occurred with the server.'
        })
    }
});

server.post('/join-community', authMiddleware, async (req, res) => { // Finalized:
    try {
        // Extract the required data:
        const user = req.user;
        const supabaseClient = req.supabase; 
        const { communityCode } = req.body;

        // Attempt to join community:
        const result = await joinCommunity(user.id, communityCode, supabaseClient); 
        return res.status(200).json(result); 
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.post('/approve-join-request', authMiddleware, async (req, res) => { // Finalized: Requires AuthToken, NewUserID, CommunityID
    try{
        // Extract the required data:
        const user = req.user; 
        const supabaseClient = req.supabase;
        const { newUserID, communityID } = req.body;
        
        // Check if the user is an admin: 
        const isAdmin = await isUserAnAdmin(user.id, communityID, supabaseClient);

        if (isAdmin) {
            const requestResult = await approveCommunityJoinRequest(newUserID, communityID, supabaseClient);
            return res.status(200).json(requestResult);
        }
        else {
            throw new ErrorHandler("You are not authorized to complete this action.", 401);
        }
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
}); 

server.post('/create-post', authMiddleware, upload.single("postImage"), async (req, res) => { // Temp Finalized: Needs isInCommunity Check + Failure handle
    try {
        // Extract the client & user:
        const supabaseClient = req.supabase;
        const user = req.user; // Extract user id

        // Extract the required text data:
        const { communityID, communityName, postTitle, postDescription } = req.body;
        if (!communityID || !communityName || !postTitle || !postDescription) {
            throw new ErrorHandler("Required information is missing. Please enter it.", 400);
        }

        // Extract the image if one:
        const postImage = req.file;

        // Call create post function:
        const result = await createPost(communityID, communityName, user.id, postTitle, postDescription, postImage, supabaseClient);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.post('/create-announcement', authMiddleware, upload.single("announcementImage"), async (req, res) => { // Temp Finalized: Needs isInCommunity Check + Failure handle
    try {
        // Extract the client & user:
        const supabaseClient = req.supabase;
        const user = req.user; // Extract user id

        // Extract the required text data:
        const { communityID, communityName, announcementTitle, announcementDescription, announcementRole } = req.body;
        if (!communityID || !communityName || !announcementTitle || !announcementDescription || !announcementRole) {
            throw new ErrorHandler("Required information is missing. Please enter it.", 400);
        }

        // Extract the image if one:
        const announcementImage = req.file;
        console.log(announcementImage); 

        // Call create announcement function:
        const result = await createAnnouncement(communityID, communityName, user.id, announcementTitle, announcementDescription, announcementRole, announcementImage, supabaseClient);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

// PATCH Methods:
server.patch('/update-bio', authMiddleware, async (req, res) => {
    try {
        const { newBio } = req.body;
        const result = await updateBio(newBio, req.supabase);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.patch('/update-profile-picture', upload.single("newProfileImage"), authMiddleware, async (req, res) => {
    try {
        const newProfileImage = req.file;
        const supabaseClient = req.supabase;
        const user = req.user; 

        // Call the function:
        const result = await updateProfilePicture(user.id, newProfileImage, supabaseClient); 
        return res.status(200).json(result); 
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.patch('/change-join-code', authMiddleware, async (req, res) => { // Finalized: Requires AuthToken, CommunityID
    try {
        // Extract the required data:
        const user = req.user; 
        const supabaseClient = req.supabase;
        const { communityID } = req.body;

        // Check if the user is an admin:
        const isAdmin = await isUserAnAdmin(communityID, user.id, supabaseClient);

        // If admin, change the code of community:
        if (isAdmin) {
            const changeRequestResult = await changeJoinCode(communityID, supabaseClient);
            return res.status(200).json(changeRequestResult);
        }
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.patch('/escalate-privilage', authMiddleware, async (req, res) => {
    
});

// DELETE Methods:
server.delete('/leave-community', authMiddleware, async (req, res) => { // FINISH DEBUGGING
    try {
        // Community ID:
        const { communityID } = req.query;

        // See if the user is in the community:
        const isInCommunity = await isUserInThisCommunity(req.user.id, communityID, req.supabase);
        if (!isInCommunity.success) {
            res.status(401).json(isInCommunity);
        }

        // See if the user is an admin:
        const isAdmin = await isUserAnAdmin(req.user.id, communityID, req.supabase);

        console.log(isAdmin); 

        // If they are admin, handle edge cases:
        if (isAdmin) {
            const adminCount = await adminCommunityCount(req.user.id, communityID, req.supabase);
            const memberCount = await memberCommunityCount(req.user.id, communityID, req.supabase); 
            console.log(adminCount);
            console.log(memberCount);

            // There are other admins:
            if (adminCount.count >= 1) {
                console.log("Other admins");
                const leaveStatus = await leaveCommunity(req.user.id, communityID, req.supabase);
                return res.status(200).json(leaveStatus);
            }
            // I am alone entirely:
            if (adminCount.count === 0 && memberCount.count === 0) {
                console.log("Alone Entirely");
                const leaveStatus = await leaveCommunity(req.user.id, communityID, req.supabase);
                const deleteStatus = await deleteCommunity(communityID, req.supabase); 
                return res.status(200).json(leaveStatus);
            }
            // I am the only admin but there are members:
            if (adminCount.count === 0 && memberCount.count >= 1) { 
                console.log("Only admin.");
                return res.status(400).json({
                    success: false,
                    message: "You must promote a user to an admin position before leaving. Rule of thumb, there must always be one admin present in a community."
                })
            }
        }
        else {
            console.log("Only a member.");
            const leaveStatus = await leaveCommunity(req.user.id, communityID, req.supabase); 
            return res.status(200).json(leaveStatus);
        }
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to request call for join community at this time.'
        })
    }
});

server.delete('/decline-join-request', async (req, res) => {
    const { userID, communityID } = req.body;
    const bearerToken = req.headers['authorization'];
    
    try {
        console.log(`[/decline-join-request] Request received - userID: ${userID}, communityID: ${communityID}`);
        
        // Decline the result: 
        const declineResult = await declineJoinRequest(userID, communityID, bearerToken);
        
        console.log(`[/decline-join-request] declineResult:`, declineResult);

        if (declineResult.declined) {
            return res.status(200).json({
                success: true, 
                message: 'The user was successfully declined.'
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: declineResult.result || 'The user was not declined. Try again.'
            })
        }
    }
    catch (error) {
        console.error(`[/decline-join-request] Error:`, error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

// Listening Port:
server.listen(PORT, (error) => {
    if (error) {
        console.log(`There was an error starting the server on port: ${PORT}`);
        return;
    }
    console.log(`Server listening on port: ${PORT}`);
});

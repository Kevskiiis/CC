import { getSupabaseUserClient } from "../api/supabase/localSupabaseClient.js";

export default async function authMiddleware (req, res, next) {
    // Slice away the "Bearer " part. Only obtain token.
    const accessToken = req.headers['authorization']?.trim();

    // Handle if there is not token provided: 
    if (!accessToken) {
        return res.status(500).json({
            success: false,
            message: 'Must sign-in before making this call.'
        })
    }

    // Handle the token to create a client now:
    const supabaseUser = await getSupabaseUserClient(accessToken); 

    // Get the user now from supabase:
    const {data: {user}, error: userError} = await supabaseUser.auth.getUser();

    // Handle error retrieval for the error:
    if (userError  || !user) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization."
        });
    }

    // Attach the user to the request call now and move one:
    req.user = user;            // the Supabase user object
    req.supabase = supabaseUser; // the client authorized as that user
    req.accessToken = accessToken;
    next(); 
}
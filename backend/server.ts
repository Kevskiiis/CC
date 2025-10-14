// import express from "express";
// import { createClient } from "@supabase/supabase-js";
// import dotenv from "dotenv";

// // Dot Env:
// dotenv.config({path: '.env.local'});

// // Server configuations:
// const server = express();
// const PORT = 3000;

// // Database:
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// // Parse JSON request bodies
// server.use(express.json());

// // Parse URL-encoded data (like form submissions)
// server.use(express.urlencoded({ extended: true }));

// // REST Calls: 
// server.post('/login', async (req, res) => {
//     try {
//         const {email, password} = req.body;
//         const {data: authData, error: authError} = await supabase.auth.signInWithPassword({
//             email,
//             password
//         })

//         if (authError) {
//             // handle
//         }   

//         return res.json({
//             error: false,
//             user: authData.user,
//             session: authData.session
//         });

//     }
//     catch (error) {

//     }
// });

// server.post('/create-user', async (req, res) => {
//     try {
//         const {firstName, lastName, phoneNumber, email, password} = req.body;
//         const {data: authData, error: authError} = await supabase.auth.signUp({
//             email,
//             password
//         })

//         if (authError) {
//             res.json({error: true})
//         }

//         const user = authData.user;

//         if (!user) {
//             return res.json({ error: true, message: "User creation failed." });
//         }

//         const {data: profileData, error: profileError } = await supabase
//             .from('profiles')
//             .insert([{
//                 id: user.id,
//                 firstName: firstName,
//                 lastName: lastName, 
//                 phoneNumber: phoneNumber
//             }])

//         if (profileError) {
//             res.json({error: true});
//         }

//         // return res.json({
//         //     error: false,
//         //     session: authData.session,  
//         //     user: authData.user,
//         // });
//     }
//     catch (error) {

//     }
// });

// server.listen(PORT, () => {
//     console.log(`Listening on PORT: ${PORT}`);
// });
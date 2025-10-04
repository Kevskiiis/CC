import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Server configuations:
const server = express();
const PORT = 3000;

// Dot Env:
dotenv.config();

server.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});
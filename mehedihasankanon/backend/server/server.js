import path from "path";
import express from "express";
import cors from "cors";
// import dotenv from "dotenv";

// const __dirname = path.resolve();

// dotenv.config({
//     path: path.resolve(__dirname, "../.env"),
// });

import { prisma } from "./database/db.js";


const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

app.get("/api/health", async(req, res) => {

    console.log("Connecting to:", process.env.DATABASE_URL?.split('@')[1]);

    try {
        // check if DB is reachable
        const user = await prisma.user.findFirst();

        res.json({
            success: true,
            message: "Server is running",
            user,
            timestamp: new Date().toISOString(),
        });
        
    }
    catch (err) {
        console.log(err);
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            timestamp: new Date().toISOString(),
        });
    }

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
import "./config/env.js";

import express from "express";
import cors from "cors";

import { createRouteHandler } from "uploadthing/express";
import uploadRouter from "./routes/uploadRouter.js";
import authRouter from "./routes/authRouter.js";

import { prisma } from "./database/db.js";

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

// ================ Routes ==============

// app.use(__path__, __middleware__) -> use this middleware whenever the path starts with __path__
// this middleware ensures all uploads are handled
// for each file upload, uploadthing server will send a request to this path with a payload
// so on that callback request we save the file to DB using prisma

app.use(
  "/api/upload",
  createRouteHandler({
    router: uploadRouter,
    config: {
      // uploadthing server calls this url after upload is complete
      callbackUrl: `${process.env.BACKEND_URL}/api/upload`,
    },
  }),
);

app.use("/api/auth", authRouter);

// ==========

app.get("/api/health", async (req, res) => {
  console.log("Connecting to:", process.env.DATABASE_URL?.split("@")[1]);

  try {
    // check if DB is reachable
    const user = await prisma.user.findFirst();

    res.json({
      success: true,
      message: "Server is running",
      user,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
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

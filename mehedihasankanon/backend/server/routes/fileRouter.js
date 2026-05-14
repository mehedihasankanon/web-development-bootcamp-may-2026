
import express from "express";

const router = express.Router();

import { listFiles, toggleFileAccess, deleteFile } from "../controllers/fileController.js";

import { authenticateToken } from "../middleware/jwt.js";

router.get("/get-all", authenticateToken, listFiles);
router.patch("/toggle-access/:fileId", authenticateToken, toggleFileAccess);
router.delete("/delete/:fileId", authenticateToken, deleteFile);

export default router;
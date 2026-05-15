
import express from "express";

const router = express.Router();

import { listFiles, toggleFileAccess, deleteFile, renameFile } from "../controllers/fileController.js";

import { authenticateToken } from "../middleware/jwt.js";

router.get("/get-all", authenticateToken, listFiles);
router.patch("/toggle-access/:fileId", authenticateToken, toggleFileAccess);
router.patch("/rename/:fileId", authenticateToken, renameFile);
router.delete("/delete/:fileId", authenticateToken, deleteFile);

export default router;
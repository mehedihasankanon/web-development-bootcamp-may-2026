import express from "express";

import { listFolders, createFolder } from "../controllers/folderController.js";
import { authenticateToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/get-all", authenticateToken, listFolders);
router.post("/create", authenticateToken, createFolder);

export default router;

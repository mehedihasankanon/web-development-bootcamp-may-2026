import express from "express";

const router = express.Router();

import { register, login, forgotPassword, changePassword } from "../controllers/authController.js";
import authenticateToken from "../middleware/jwt.js"


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/change-password", authenticateToken, changePassword);


export default router;
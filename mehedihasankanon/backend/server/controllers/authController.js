import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

import { sendResetEmail } from "../utils/resend.js";

import { prisma } from "../database/db.js";

import { JWT_SECRET } from "../middleware/jwt.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        
        // Generate JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        res.status(201).json({
            message: "User registered successfully",
            user,
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to register user" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        res.json({
            message: "Login successful",
            user,
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to login" });
    }
};

// TODO: implement emailing service and modify this code accordingly
export const forgotPassword = async (req, res) => {
    try {
        
        const { email } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Save reset token to database
        await prisma.user.update({
            where: { email },
            data: { resetToken },
        });

        // Send reset link via email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
        await sendResetEmail(email, resetLink);

        res.json({ message: "Reset link sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send reset link" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to change password" });
    }
};
/**
 * 
 * pasted this JWT setup code from my old academic project:
 * 
 * https://github.com/mehedihasankanon/MARS/blob/main/mars/backend/server/middleware/jwt.js
 * 
 */

const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_SECRET = process.env.JWT_SECRET;

exports.JWT_SECRET = JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

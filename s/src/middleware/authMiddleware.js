// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Not authorized, invalid token" });
    }
};

export const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
        } catch (error) {
            // Invalid token, but we don't want to block the request
            console.log("Optional auth token invalid");
        }
    }

    next();
};

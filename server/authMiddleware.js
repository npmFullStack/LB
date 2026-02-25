// authMiddleware.js
import jwt from "jsonwebtoken";
import { createResponse } from "./helper.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json(createResponse(false, "Access token required"));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(createResponse(false, "Token expired"));
    }
    return res.status(403).json(createResponse(false, "Invalid token"));
  }
};

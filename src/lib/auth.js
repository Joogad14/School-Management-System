import jwt from "jsonwebtoken";

export function verifyToken(token) {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export function getTokenFromHeader(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const parts = authHeader.split(" ");

  if (parts.length !== 2) return null;

  return parts[1];
}
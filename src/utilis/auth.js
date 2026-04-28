import jwt from "jsonwebtoken";

export function verifyUser(req) {
  const token = req.headers.get("x-access-token");

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}
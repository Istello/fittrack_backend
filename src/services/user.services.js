import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.JWT_ACCESS,
    { expiresIn: "5m" },
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.JWT_REFRESH,
    { expiresIn: "7d" },
  );
}

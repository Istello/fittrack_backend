import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/user.models.js";

export async function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  //   confirm that there is authorization
  if (!authorization) {
    return res.status(401).send({ detail: "No Authorization header" });
  }
  //   confirm that it is a beare token
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).send({ detail: "Bearer token is required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedUser = jwt.verify(token, env.JWT_ACCESS);
    const userId = decodedUser.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ detail: "Invalid token or expired token" });
    }
    req.user = user.toObject();
    next();
  } catch {
    return res.status(401).json({ detail: "Invalid token or expired token" });
  }
}

export async function adminsOnly(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .json({ detail: "You are not allowed to access this resource" });
  }

  if (req.user.role != "admin") {
    return res
      .status(403)
      .json({ detail: "You are not allowed to access this resource" });
  }

  next();
}

import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/user.services.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { userValidator } from "../validators/user.validator.js";

     

export async function signup(req, res) {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      detail: "Request body is required"
    });
  }

  const { error, value } = userValidator.validate(body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      errors: error.details
    });
  }

  const { username, password, email } = value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      detail: "Invalid e-mail address"
    });
  }

  const emailExistsUser = await User.findOne({ email });

  if (emailExistsUser) {
    return res.status(409).json({
      detail: "Email already exists"
    });
  }

  const usernameExistsUser = await User.findOne({ username });

  if (usernameExistsUser) {
    return res.status(409).json({
      detail: "Username already exists"
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: passwordHash
    });

    const {
      password: removedPassword,
      ...modifiedUser
    } = user.toObject();

    return res.status(201).json({
      detail: "Account created successfully",
      user: modifiedUser
    });

  } catch (e) {
    console.log(e);

    return res.status(500).json({
      detail: "Something went wrong"
    });
  }
}

export async function getProfile(req, res) {
  res.json(req.user);
}

export async function refreshAccessToken(req, res) {
  if (!req.body) {
    return res.status(400).json({ detail: "No request body sent" });
  }
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res
      .status(400)
      .send({ detail: "refreshToken not available in request body" });
  }

  try {
    const decodedUser = jwt.verify(refreshToken, env.JWT_REFRESH);
    const userId = decodedUser.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ detail: "User not found" });
    }
    const token = generateAccessToken(user);
    return res.json({ accessToken: token });
  } catch {
    return res.status(401).json({ detail: "Invalid refresh token" });
  }
}

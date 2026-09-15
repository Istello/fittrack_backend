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
      detail: "Request body is required",
    });
  }

  const { error, value } = userValidator.validate(body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      errors: error.details,
    });
  }

  const { username, password, email } = value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      detail: "Invalid e-mail address",
    });
  }

  try {
    // Check if email already exists
    const emailExistsUser = await User.findOne({ email });

    if (emailExistsUser) {
      return res.status(409).json({
        detail: "Email already exists",
      });
    }

    // Check if username already exists
    const usernameExistsUser = await User.findOne({ username });

    if (usernameExistsUser) {
      return res.status(409).json({
        detail: "Username already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      email,
      password: passwordHash,
    });

    // Remove password from response
    const {
      password: removedPassword,
      ...modifiedUser
    } = user.toObject();

    return res.status(201).json({
      detail: "Account created successfully",
      user: modifiedUser,
    });

  } catch (e) {
    console.error("Signup error:", e);

    return res.status(500).json({
      detail: "Something went wrong",
    });
  }
}


export async function getUsers(req, res) {
  try {
    const users = await User.find();

    return res.status(200).json({
      users,
    });

  } catch (e) {
    console.error("Get users error:", e);

    return res.status(500).json({
      detail: "Something went wrong!",
    });
  }
}


export async function signin(req, res) {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      detail: "Request body cannot be empty",
    });
  }

  const { password, usernameOrEmail } = body;

  if (!password || !usernameOrEmail) {
    return res.status(400).json({
      detail: "All fields are required",
      fields: ["password", "usernameOrEmail"],
    });
  }

  try {
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        detail: "Invalid login credentials",
      });
    }

    // Check password
    const isCorrect = await user.comparePassword(password);

    if (!isCorrect) {
      return res.status(401).json({
        detail: "Invalid login credentials",
      });
    }

    // Generate tokens
    const tokens = {
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    };

    return res.status(200).json(tokens);

  } catch (e) {
    console.error("Signin error:", e);

    return res.status(500).json({
      detail: "An error occurred",
    });
  }
}


export async function getProfile(req, res) {
  return res.status(200).json(req.user);
}


export async function refreshAccessToken(req, res) {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      detail: "No request body sent",
    });
  }

  const { refreshToken } = body;

  if (!refreshToken) {
    return res.status(400).json({
      detail: "Refresh token not available in request body",
    });
  }

  try {
    const decodedUser = jwt.verify(
      refreshToken,
      env.JWT_REFRESH
    );

    const userId = decodedUser.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        detail: "User not found",
      });
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken,
    });

  } catch (e) {
    console.error("Refresh token error:", e);

    return res.status(401).json({
      detail: "Invalid refresh token",
    });
  }
}

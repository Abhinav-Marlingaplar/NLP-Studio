import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw Object.assign(new Error("Email already exists"), { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error("User not found"), { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error("Incorrect password"), { status: 400 });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email }
  };
};

export const refreshAccessToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return reject(Object.assign(new Error("Invalid or expired refresh token"), { status: 403 }));
      resolve(generateAccessToken(decoded.userId));
    });
  });
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  return user;
};

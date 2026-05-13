import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // ✅ Fix
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Token revoked or invalid" });
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.userId, { refreshToken: null });

    // ✅ clearCookie must have same options as setCookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
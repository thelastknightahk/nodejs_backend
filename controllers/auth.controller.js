 const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    accessToken,
    refreshToken,
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
 exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const error = new Error("Refresh token required");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 403;
    throw error;
  }

  // 🔄 ROTATE TOKENS
  const newAccessToken = generateAccessToken({ id: user._id });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  // 🗑️ Invalidate old refresh token
  user.refreshToken = newRefreshToken;
  await user.save();

  res.json({
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

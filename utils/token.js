const jwt = require("jsonwebtoken");
const { accessTokenExpiry, refreshTokenExpiry } = require("../config/jwt");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: accessTokenExpiry,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: refreshTokenExpiry,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

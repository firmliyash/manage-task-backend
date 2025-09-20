import jwt from "jsonwebtoken";
import dotenv from "dotenv"; 

dotenv.config();
export const JWT = {
  async verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return error;
    }
  },
  async verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return error;
    }
  },
  createAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
  },
  createRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
  },
};

import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../../utils/token.utils.js";
import User from "../../../models/user.model.js";

export const refreshTokenService = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    userId: decoded.userId,
  });

  return accessToken;
};

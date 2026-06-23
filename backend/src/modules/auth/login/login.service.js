import bcrypt from "bcryptjs";

import User from "../../../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/token.utils.js";






export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  // generate  jwt token
  const accessToken = generateAccessToken({
    userId: user._id,
  });

  // generate  refresh token
  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  await User.findByIdAndUpdate(user._id, {
    refreshToken,
  }); 
  
  return {
    user,
    accessToken,
    refreshToken
  };
};

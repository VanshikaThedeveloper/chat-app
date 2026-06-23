import User from "../../../models/user.model.js";

export const logoutService = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: "" });

  return true;
};

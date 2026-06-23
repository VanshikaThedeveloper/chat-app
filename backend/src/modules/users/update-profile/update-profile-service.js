import User from "../../../models/user.model.js";

export const updateProfileService = async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedUser;
};

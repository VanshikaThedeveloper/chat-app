import User from "../../../models/user.model.js";

export const getUserService = async (
  userId
) => {

  const user = await User.findById(
    userId
  ).select(
    "_id username bio profilePicture isOnline lastSeen"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
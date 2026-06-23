import User from "../../../models/user.model.js";

export const searchUsersService = async (query, currentUserId) => {
  const users = await User.find({
    $and: [
      {
        _id: {
          $ne: currentUserId,
        },
      },
      {
        username: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  })
    .select("_id username profilePicture isOnline")
    .limit(20);

  return users;
};

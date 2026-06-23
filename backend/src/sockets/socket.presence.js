import User from "../models/user.model.js";

export const setUserOnline = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    isOnline: true,
  });
};

export const setUserOffline = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    isOnline: false,
    lastSeen: new Date(),
  });
};

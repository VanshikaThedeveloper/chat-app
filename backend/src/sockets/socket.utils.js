import connectedUsers from "./connected-users.js";

export const getUserSocketId = (userId) => {
  return connectedUsers.get(userId.toString());
};

import connectedUsers from "./connected-users.js";

export const getUserSocketId = (userId) => {
  const sockets = connectedUsers.get(userId.toString());
  if (sockets && sockets.size > 0) {
    return Array.from(sockets)[0];
  }
  return undefined;
};

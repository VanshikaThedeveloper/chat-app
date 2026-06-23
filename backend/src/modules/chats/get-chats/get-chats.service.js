import Chat from "../../../models/chat.model.js";

export const getChatsService = async (userId) => {
  const chats = await Chat.find({
    participants: userId,
  })
    .populate("participants", "_id username profilePicture isOnline")
    .populate("lastMessage")
    .sort({
      updatedAt: -1,
    });

  return chats;
};

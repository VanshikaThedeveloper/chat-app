import Chat from "../../../models/chat.model.js";

export const getChatService = async (chatId, userId) => {
  const chat = await Chat.findById(chatId)
    .populate("participants", "_id username profilePicture isOnline")
    .populate("lastMessage");

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (participant) => participant._id.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Access denied");
  }

  return chat;
};

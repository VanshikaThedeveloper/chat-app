import Chat from "../../../models/chat.model.js";
import User from "../../../models/user.model.js";

export const createChatService = async (currentUserId, participantId) => {
  if (currentUserId.toString() === participantId.toString()) {
    throw new Error("You cannot create a chat with yourself");
  }

  const participant = await User.findById(participantId);

  if (!participant) {
    throw new Error("User not found");
  }

  const existingChat = await Chat.findOne({
    chatType: "private",
    participants: {
      $all: [currentUserId, participantId],
    },
  });

  if (existingChat) {
    return existingChat;
  }

  const chat = await Chat.create({
    participants: [currentUserId, participantId],
  });

  return chat;
};

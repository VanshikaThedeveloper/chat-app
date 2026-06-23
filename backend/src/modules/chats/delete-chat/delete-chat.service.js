import Chat from "../../../models/chat.model.js";
import Message from "../../../models/message.model.js";

export const deleteChatService = async (chatId, userId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (participant) => participant.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Access denied");
  }

  await Message.deleteMany({
    chatId,
  });

  await Chat.findByIdAndDelete(chatId);

  return true;
};

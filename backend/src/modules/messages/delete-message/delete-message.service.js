import Message from "../../../models/message.model.js";
import Chat from "../../../models/chat.model.js";

export const deleteMessageService = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId.toString() !== userId.toString()) {
    throw new Error("Access denied");
  }

  await Message.findByIdAndDelete(messageId);

  return true;
};

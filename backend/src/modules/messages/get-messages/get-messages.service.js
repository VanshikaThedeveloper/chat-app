import Chat from "../../../models/chat.model.js";
import Message from "../../../models/message.model.js";
import mongoose from "mongoose";

export const getMessagesService = async (chatId, userId) => {

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }


  
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

  const messages = await Message.find({
    chatId,
  })
    .populate("senderId", "_id username profilePicture")
    .sort({
      createdAt: 1,
    })
    .limit(50);

  return messages;
};

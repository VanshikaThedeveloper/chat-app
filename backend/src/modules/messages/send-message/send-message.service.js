import Chat from "../../../models/chat.model.js";
import Message from "../../../models/message.model.js";
import { SOCKET_EVENTS } from "../../../sockets/socket.event.js";

import { getIO } from "../../../sockets/socket.server.js";
import { getUserSocketId } from "../../../sockets/socket.utils.js";


export const sendMessageService = async (chatId, senderId, content) => {
  const chat = await Chat.findById(chatId).populate(
    "participants",
    "_id username profilePicture",
  );

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (participant) => participant._id.toString() === senderId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Access denied");
  }

  const message = await Message.create({
    chatId,
    senderId,
    content,
  });

  chat.lastMessage = message._id;
  chat.lastMessageAt = message.createdAt;

  await chat.save();

  const receiver = chat.participants.find(
    (participant) => participant._id.toString() !== senderId.toString(),
  );

  if (receiver) {
    const receiverSocketId = getUserSocketId(receiver._id.toString());

    if (receiverSocketId) {
      message.status = "delivered";

      await message.save();

      console.log(`Message delivered to socket: ${receiverSocketId}`);
    }
  }

  const populatedMessage = await Message.findById(message._id).populate(
    "senderId",
    "_id username profilePicture",
  );

  if (receiver) {
    const receiverSocketId = getUserSocketId(receiver._id.toString());

    if (receiverSocketId) {
      getIO()
        .to(receiverSocketId)
        .emit(SOCKET_EVENTS.RECEIVE_MESSAGE, populatedMessage);
    }
  }

  return populatedMessage;
};

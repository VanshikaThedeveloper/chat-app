import Chat from "../models/chat.model.js";
import { SOCKET_EVENTS } from "./socket.event.js";

import { getIO } from "./socket.server.js";

import { getUserSocketId } from "./socket.utils.js";



export const handleTyping = async (userId, chatId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return;
  }

  const receiver = chat.participants.find(
    (participant) => participant.toString() !== userId.toString(),
  );

  if (!receiver) {
    return;
  }

  const receiverSocketId = getUserSocketId(receiver.toString());

  if (!receiverSocketId) {
    return;
  }

  getIO().to(receiver.toString()).emit(SOCKET_EVENTS.TYPING, {
    chatId,
    userId,
  });
};

export const handleStopTyping = async (userId, chatId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return;
  }

  const receiver = chat.participants.find(
    (participant) => participant.toString() !== userId.toString(),
  );

  if (!receiver) {
    return;
  }

  const receiverSocketId = getUserSocketId(receiver.toString());

  if (!receiverSocketId) {
    return;
  }

  getIO().to(receiver.toString()).emit(SOCKET_EVENTS.STOP_TYPING, {
    chatId,
    userId,
  });
};
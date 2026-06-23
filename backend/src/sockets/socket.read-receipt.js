import Message from "../models/message.model.js";

export const markMessageAsRead = async (messageId) => {
  const message = await Message.findByIdAndUpdate(
    messageId,
    {
      status: "read",
    },
    {
      new: true,
    },
  );

  return message;
};



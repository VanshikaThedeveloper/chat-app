import { getMessagesService } from "./get-messages.service.js";

export const getMessagesController = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await getMessagesService(chatId, req.user._id);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

import { getChatService } from "./get-chat.service.js";

export const getChatController = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await getChatService(chatId, req.user._id);

    return res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

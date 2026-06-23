import { deleteChatService } from "./delete-chat.service.js";

export const deleteChatController = async (req, res) => {
  try {
    const { chatId } = req.params;

    await deleteChatService(chatId, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

import { deleteMessageService } from "./delete-message.service.js";

export const deleteMessageController = async (req, res) => {
  try {
    const { messageId } = req.params;

    await deleteMessageService(messageId, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

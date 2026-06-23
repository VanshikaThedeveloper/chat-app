import { getChatsService } from "./get-chats.service.js";

export const getChatsController = async (req, res) => {
  try {
    const chats = await getChatsService(req.user._id);

    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import { validationResult } from "express-validator";

import { sendMessageService } from "./send-message.service.js";

export const sendMessageController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { chatId, content } = req.body;

    const message = await sendMessageService(chatId, req.user._id, content);

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

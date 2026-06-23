import { validationResult } from "express-validator";

import { createChatService } from "./create-chat.service.js";

export const createChatController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { participantId } = req.body;

    const chat = await createChatService(req.user._id, participantId);

    return res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

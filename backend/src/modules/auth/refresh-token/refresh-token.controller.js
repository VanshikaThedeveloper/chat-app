import { validationResult } from "express-validator";

import { refreshTokenService } from "./refresh-token.service.js";

export const refreshTokenController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { refreshToken } = req.body;

    const accessToken = await refreshTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

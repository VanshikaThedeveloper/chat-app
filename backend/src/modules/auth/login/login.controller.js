import { validationResult } from "express-validator";

import { loginUserService } from "./login.service.js";

export const loginController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const result = await loginUserService({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: result.user._id,
          username: result.user.username,
          email: result.user.email,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

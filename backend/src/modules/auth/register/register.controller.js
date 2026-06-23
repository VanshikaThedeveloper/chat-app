import { validationResult } from "express-validator";
import { registerUserService } from "./register.service.js";

export const registerController = async (req, res) => {
  try {
    // validation error
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;

    const user = await registerUserService({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

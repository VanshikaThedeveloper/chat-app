import { logoutService } from "./logout.service.js";

export const logoutController = async (req, res) => {
  try {
    await logoutService(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

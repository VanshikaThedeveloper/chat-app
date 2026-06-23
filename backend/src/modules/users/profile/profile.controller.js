import { getProfileService } from "./profile.service.js";

export const profileController = async (req, res) => {
  try {
    const user = await getProfileService(req.user);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

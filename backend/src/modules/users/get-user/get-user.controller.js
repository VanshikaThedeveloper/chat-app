import { getUserService } from "./get-user.service.js";

export const getUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserService(id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

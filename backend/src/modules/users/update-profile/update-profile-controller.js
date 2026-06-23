import { validationResult } from "express-validator";
import { updateProfileService } from "./update-profile-service.js";


export const updateProfileController = async (req, res) => {
  try {

    // 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // extract the data from the request body
    const { username, bio, profilePicture } = req.body;


    
    const updateData = {
      username,
      bio,
      profilePicture,
    };



    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });


    const updatedUser = await updateProfileService(req.user._id, updateData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

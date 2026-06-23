import { Router } from "express";

import authMiddleware from "../../../middlewares/auth.middlewares.js";
import { updateProfileValidation } from "./update-profile-validation.js";
import { updateProfileController } from "./update-profile-controller.js";

const updateProfileRouter = Router();

updateProfileRouter.put(
  "/profile",
  authMiddleware,
  updateProfileValidation,
  updateProfileController,
);

export default updateProfileRouter;

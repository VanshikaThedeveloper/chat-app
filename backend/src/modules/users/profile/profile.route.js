import { Router } from "express";

import { profileController } from "./profile.controller.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const profileRouter = Router();

profileRouter.get("/profile", authMiddleware, profileController);

export default profileRouter;

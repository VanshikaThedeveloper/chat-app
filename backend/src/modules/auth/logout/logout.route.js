import { Router } from "express";

import authMiddleware from "../../../middlewares/auth.middlewares.js";

import { logoutController } from "./logout.controller.js";

const logoutRouter = Router();

logoutRouter.post("/logout", authMiddleware, logoutController);

export default logoutRouter;

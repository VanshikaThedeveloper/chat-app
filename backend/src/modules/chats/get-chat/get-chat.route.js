import { Router } from "express";

import authMiddleware from "../../../middlewares/auth.middlewares.js";

import { getChatController } from "./get-chat.controller.js";

const getChatRouter = Router();

getChatRouter.get("/:chatId", authMiddleware, getChatController);

export default getChatRouter;

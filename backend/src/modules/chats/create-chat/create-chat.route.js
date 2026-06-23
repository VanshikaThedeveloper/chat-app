import { Router } from "express";



import { createChatController } from "./create-chat.controller.js";

import { createChatValidation } from "./create-chat.validation.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const createChatRouter = Router();

createChatRouter.post(
  "/",
  authMiddleware,
  createChatValidation,
  createChatController,
);

export default createChatRouter;

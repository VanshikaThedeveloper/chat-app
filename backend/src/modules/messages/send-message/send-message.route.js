import { Router } from "express";



import { sendMessageController } from "./send-message.controller.js";

import { sendMessageValidation } from "./send-message.validation.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const sendMessageRouter = Router();

sendMessageRouter.post(
  "/",
  authMiddleware,
  sendMessageValidation,
  sendMessageController,
);

export default sendMessageRouter;

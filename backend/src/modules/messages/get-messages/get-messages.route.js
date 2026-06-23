import { Router } from "express";


import { getMessagesController } from "./get-messages.controller.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const getMessagesRouter = Router();

getMessagesRouter.get("/:chatId", authMiddleware, getMessagesController);

export default getMessagesRouter;

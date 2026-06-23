import { Router } from "express";



import { deleteChatController } from "./delete-chat.controller.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const deleteChatRouter = Router();

deleteChatRouter.delete("/:chatId", authMiddleware, deleteChatController);

export default deleteChatRouter;

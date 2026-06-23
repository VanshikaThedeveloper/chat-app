import { Router } from "express";



import { getChatsController } from "./get-chats.controller.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const getChatsRouter = Router();

getChatsRouter.get("/", authMiddleware, getChatsController);

export default getChatsRouter;

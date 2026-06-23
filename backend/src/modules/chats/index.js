import { Router } from "express";

import createChatRouter from "./create-chat/create-chat.route.js";
import getChatsRouter from "./get-chats/get-chats.route.js";
import getChatRouter from "./get-chat/get-chat.route.js";
import deleteChatRouter from "./delete-chat/delete-chat.route.js";

const chatsRouter = Router();

chatsRouter.use(createChatRouter);
chatsRouter.use(getChatsRouter);
chatsRouter.use(getChatRouter);
chatsRouter.use(deleteChatRouter);

export default chatsRouter;

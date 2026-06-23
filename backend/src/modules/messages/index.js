import { Router } from "express";

import sendMessageRouter from "./send-message/send-message.route.js";
import getMessagesRouter from "./get-messages/get-messages.route.js";
import deleteMessageRouter from "./delete-message/delete-message.route.js";

const messagesRouter = Router();

messagesRouter.use(sendMessageRouter);
messagesRouter.use(getMessagesRouter);
messagesRouter.use(deleteMessageRouter);

export default messagesRouter;

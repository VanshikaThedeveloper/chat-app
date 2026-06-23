import { Router } from "express";



import { deleteMessageController } from "./delete-message.controller.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const deleteMessageRouter = Router();

deleteMessageRouter.delete(
  "/:messageId",
  authMiddleware,
  deleteMessageController,
);

export default deleteMessageRouter;

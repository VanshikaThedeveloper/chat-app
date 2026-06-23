import { Router } from "express";


import { getUserController } from "./get-user.controller.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";

const getUserRouter = Router();

getUserRouter.get("/:id", authMiddleware, getUserController);

export default getUserRouter;

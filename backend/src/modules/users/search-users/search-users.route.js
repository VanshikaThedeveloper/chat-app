import { Router } from "express";
import { searchUsersController } from "./search-users.controller.js";
import authMiddleware from "../../../middlewares/auth.middlewares.js";



const searchUsersRouter = Router();

searchUsersRouter.get("/search", authMiddleware, searchUsersController);

export default searchUsersRouter;

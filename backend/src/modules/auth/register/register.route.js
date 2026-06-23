import { Router } from "express";
import { registerController } from "./register.controller.js";
import { registerValidation } from "./register.validation.js";

const registerRouter = Router();

registerRouter.post(
  "/register",
  registerValidation,
  registerController,
);

export default registerRouter;

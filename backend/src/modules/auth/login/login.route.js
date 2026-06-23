import { Router } from "express";

import { loginController } from "./login.controller.js";

import { loginValidation } from "./login.validation.js";

const loginRouter = Router();

loginRouter.post("/login", loginValidation, loginController);

export default loginRouter;

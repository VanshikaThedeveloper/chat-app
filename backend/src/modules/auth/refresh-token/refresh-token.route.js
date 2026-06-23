import { Router } from "express";

import { refreshTokenController } from "./refresh-token.controller.js";

import { refreshTokenValidation } from "./refresh-token.validation.js";

const refreshTokenRouter = Router();

refreshTokenRouter.post(
  "/refresh-token",
  refreshTokenValidation,
  refreshTokenController,
);

export default refreshTokenRouter;

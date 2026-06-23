import { Router } from "express";
import registerRouter from "./register/register.route.js";
import loginRouter from "./login/login.route.js";
import refreshTokenRouter from "./refresh-token/refresh-token.route.js";
import logoutRouter from "./logout/logout.route.js";


const authRouter = Router()

authRouter.use(registerRouter)
authRouter.use(loginRouter);
authRouter.use(refreshTokenRouter);
authRouter.use(logoutRouter);


export default authRouter

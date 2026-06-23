import { Router } from "express";

import profileRouter from "./profile/profile.route.js";
import updateProfileRouter from "./update-profile/update-profile-route.js";
import searchUsersRouter from "./search-users/search-users.route.js";
import getUserRouter from "./get-user/get-user.route.js";

const usersRouter = Router();

usersRouter.use(profileRouter);
usersRouter.use(updateProfileRouter);
usersRouter.use(searchUsersRouter);
usersRouter.use(getUserRouter);


export default usersRouter;

import { Router } from "express";
import { authRouter } from "../src/routers/auth.router";
import { userRouter } from "../src/routers/user.router";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);

export { apiRouter };
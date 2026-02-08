import { Router } from "express";
import { getMiddlewareFromController } from "../middlewares/getMiddlewareFromController";
import { userControllerInstance } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();

function getMiddleware(method: keyof typeof userControllerInstance) {
  return getMiddlewareFromController(userControllerInstance, method);
}

userRouter.use(authMiddleware);

userRouter.get("/me", getMiddleware("getProfile"));

export { userRouter };
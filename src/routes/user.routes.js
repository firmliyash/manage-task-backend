import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const userRouter = Router();

// Public routes
userRouter.get("/list", authMiddleware, userController.getUserList);
userRouter.get("/dropdown", authMiddleware, userController.getDropdownList);

export default userRouter;

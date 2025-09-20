import { Router } from "express";
import userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";
const userRouter = Router();

// Public routes
userRouter.get("/list", authMiddleware, checkAdmin, userController.getUserList);

export default userRouter;

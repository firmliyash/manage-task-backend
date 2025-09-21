import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";
const authRouter = Router();

// Public routes with auth rate limiting
authRouter.post("/signup", authLimiter, authController.signup); 
authRouter.post("/login", authLimiter, authController.login);

 
export default authRouter;

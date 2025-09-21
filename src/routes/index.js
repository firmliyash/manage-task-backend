import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRouter from "./user.routes.js";
import projectRoutes from "./projects.routes.js";
import taskRoutes from "./tasks.routes.js";

const allRoutes = Router();

// API routes
allRoutes.use("/auth", authRoutes);
allRoutes.use("/user", userRouter);
allRoutes.use("/project", projectRoutes);
allRoutes.use("/tasks", taskRoutes);

export default allRoutes;

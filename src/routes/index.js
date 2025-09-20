import { Router } from "express";
import authRoutes from "./auth.js";
import userRouter from "./user.js";
import projectRoutes from "./projects.js";
import taskRoutes from "./tasks.js";

const allRoutes = Router();

// API routes
allRoutes.use("/auth", authRoutes);
allRoutes.use("/user", userRouter);
allRoutes.use("/projects", projectRoutes);
allRoutes.use("/tasks", taskRoutes);

export default allRoutes;

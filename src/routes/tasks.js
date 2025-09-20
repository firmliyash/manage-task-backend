import { Router } from "express";
import taskController from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/", authMiddleware, taskController.createTask);
router.get("/my-tasks", authMiddleware, taskController.getUserTasks);
router.get("/:id", authMiddleware, taskController.getTask);
router.put("/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

router.post("/:id/assign", authMiddleware, taskController.assignTask);
router.patch("/:id/status", authMiddleware, taskController.updateTaskStatus);

router.get("/projects/:projectId", authMiddleware, taskController.getProjectTasks);

export default router;
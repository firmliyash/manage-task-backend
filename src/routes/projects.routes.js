import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";
const router = Router();

router.post("/create", authMiddleware, projectController.createProject);
router.get("/", authMiddleware, projectController.getUserProjects);
router.get("/:id", authMiddleware, projectController.getProject);
router.put("/:id", authMiddleware, projectController.updateProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);

router.post("/:id/invite", authMiddleware, projectController.inviteUser);
router.delete("/:id/members/:userId", authMiddleware, projectController.removeUser);
router.get("/:id/members", authMiddleware, projectController.getProjectMembers);

export default router;
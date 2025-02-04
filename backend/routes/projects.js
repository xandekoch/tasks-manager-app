import Express from "express";
import { verifyToken, authorizeRole } from "../middleware/auth.js";
import { createProject, getProjects, getProject, updateProject, deleteProject, getManagers } from "../controllers/projects.js";

const router = Express.Router();

/* CREATE */
router.post('', verifyToken, authorizeRole(['admin']), createProject);

/* READ */
router.get('', verifyToken, authorizeRole(['user', 'manager', 'admin']), getProjects);
router.get('/:projectId', verifyToken, authorizeRole(['user', 'manager', 'admin']), getProject);

/* UPDATE */
router.patch('/:projectId', verifyToken, authorizeRole(['admin']), updateProject);

/* DELETE */
router.delete('/:projectId', verifyToken, authorizeRole(['admin']), deleteProject);

export default router;

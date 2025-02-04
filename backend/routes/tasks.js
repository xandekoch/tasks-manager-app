import Express from "express";
import { verifyToken, authorizeRole } from "../middleware/auth.js";
import { createTask, getTasks, getTask, updateTask, deleteTask } from "../controllers/tasks.js";

const router = Express.Router();

/* CREATE */
router.post('', verifyToken, authorizeRole(['manager', 'admin']), createTask);

/* READ */
router.get('', verifyToken, authorizeRole(['user', 'manager', 'admin']), getTasks);
router.get('/:taskId', verifyToken, authorizeRole(['user', 'manager', 'admin']), getTask);

/* UPDATE */
router.patch('/:taskId', verifyToken, authorizeRole(['manager', 'admin']), updateTask);

/* DELETE */
router.delete('/:taskId', verifyToken, authorizeRole(['admin']), deleteTask);

export default router;

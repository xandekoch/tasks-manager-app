import Express from "express";
import { authorizeRole, verifyToken } from "../middleware/auth.js";
import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from "../controllers/users.js";

const router = Express.Router();

/* CREATE */
router.post('/', verifyToken, authorizeRole(['admin']), createUser)

/* READ */
router.get('/', verifyToken, authorizeRole(['manager', 'admin']), getUsers)
router.get('/:userId', verifyToken, authorizeRole(['admin']), getUser)

/* UPDATE */
router.patch('/:userId', verifyToken, authorizeRole(['admin']), updateUser)

/* DELETE */
router.delete('/:userId', verifyToken, authorizeRole(['admin']), deleteUser)

export default router;
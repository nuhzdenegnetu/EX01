import express from 'express';
import { getUsers, getUserById } from '../controllers/users.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';

const router = express.Router();

router.get('/', verifyToken, getUsers);
router.get('/:userId', verifyToken, getUserById);

export default router;
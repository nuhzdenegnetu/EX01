import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.mjs';
import { validateUserData } from '../middlewares/validation.middleware.mjs';
import { getUsers, getUserById } from '../controllers/users.controller.mjs';

const router = express.Router();

router.get('/', authenticate, getUsers);
router.get('/:userId', authenticate, getUserById);

export default router;
import express from 'express';
import { getUsers, getUserById } from '../controllers/users.controller.mjs';

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);

export default router;
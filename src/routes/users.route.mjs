import express from 'express';
import { getUsers } from '../controllers/users.controller.mjs';
import { isAuthenticated } from '../middlewares/auth.middleware.mjs';

const router = express.Router();

router.get('/', isAuthenticated, getUsers);

export default router;
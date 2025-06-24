import express from 'express';
import {getUserById, getUsers} from '../controllers/users.controller.mjs';
import { isAuthenticated } from '../middlewares/auth.middleware.mjs';

const router = express.Router();


router.get('/', isAuthenticated, getUsers);
router.get('/:userId',isAuthenticated, getUserById )


export default router;
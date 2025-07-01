// src/routes/users.route.mjs
import express from 'express';
import { getUserById, getUsers, createUser, updateUser, deleteUser } from '../controllers/users.controller.mjs';
import { isAuthenticated } from '../middlewares/auth.middleware.mjs';

const router = express.Router();

// CRUD операции для пользователей
router.get('/', isAuthenticated, getUsers);
router.get('/:userId', isAuthenticated, getUserById);
router.post('/', isAuthenticated, createUser); // Создание пользователя
router.put('/:userId', isAuthenticated, updateUser); // Обновление пользователя
router.delete('/:userId', isAuthenticated, deleteUser); // Удаление пользователя

export default router;
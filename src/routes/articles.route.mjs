// src/routes/articles.route.mjs
import express from 'express';
import mongoose from 'mongoose';
import {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticlesPaginated,
    getArticlesStats
} from '../controllers/articles.controller.mjs';
import {isAuthenticated} from '../middlewares/auth.middleware.mjs';
import {checkArticleAccess} from '../middlewares/access.middleware.mjs';

const router = express.Router();

// Главная страница со статьями
router.get('/', getArticles);

// Специальные маршруты - должны быть определены ПЕРЕД маршрутами с параметрами
router.get('/paginated', getArticlesPaginated);
router.get('/stats', getArticlesStats);

// Создание статьи
router.post('/', isAuthenticated, createArticle);

// Маршруты для работы с конкретной статьей по ID
router.get('/:articleId', getArticleById);
router.put('/:articleId', isAuthenticated, checkArticleAccess, updateArticle);
router.delete('/:articleId', isAuthenticated, checkArticleAccess, deleteArticle);

export default router;
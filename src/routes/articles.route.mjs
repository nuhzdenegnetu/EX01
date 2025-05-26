import express from 'express';
import { checkArticleAccess } from '../middlewares/access.middleware.mjs';
import { getArticles, getArticleById } from '../controllers/articles.controller.mjs';

const router = express.Router();

router.get('/', getArticles);
router.get('/:articleId', checkArticleAccess, getArticleById);

export default router;
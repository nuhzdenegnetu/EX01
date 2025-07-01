// src/middlewares/access.middleware.mjs
import Article from '../models/article.model.mjs';

export const checkArticleAccess = async (req, res, next) => {
    try {
        const articleId = req.params.articleId;
        const userId = req.user._id;

        // Получаем статью из базы
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({message: 'Статья не найдена'});
        }

        // Проверяем, является ли текущий пользователь автором статьи
        if (article.author && article.author.toString() === userId.toString()) {
            return next();
        }

        // Или проверяем, является ли пользователь администратором
        if (req.user.role === 'admin') {
            return next();
        }

        // В противном случае доступ запрещен
        return res.status(403).json({message: 'У вас нет прав для выполнения этого действия'});
    } catch (error) {
        console.error('Ошибка при проверке доступа к статье:', error);
        return res.status(500).json({message: 'Внутренняя ошибка сервера'});
    }
};
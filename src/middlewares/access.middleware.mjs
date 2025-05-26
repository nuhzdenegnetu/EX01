export const checkArticleAccess = (req, res, next) => {
    const { articleId } = req.params;
    // Додати логіку перевірки прав доступу
    next();
};
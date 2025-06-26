export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Что-то пошло не так';

    console.error(`[${new Date().toISOString()}] Ошибка: ${err.stack}`);

    // Для API-запросов возвращаем JSON
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        return res.status(statusCode).json({
            status: 'error',
            message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // Для обычных запросов рендерим шаблон ошибки
    return res.status(statusCode).render('pug/error', {
        title: `Ошибка ${statusCode}`,
        message,
        statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
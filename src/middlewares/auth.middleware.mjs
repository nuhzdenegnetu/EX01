import jwt from 'jsonwebtoken';

const SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjkzNzY4MDAwLCJleHAiOjE2OTM3NzE2MDB9.4f5c8b1a2d3e4f5g6h7i8j9k0lmnopqrstuvwx'; // Используйте безопасный ключ

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Если заголовка нет или формат неверный
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Для HTML-запросов перенаправляем на страницу входа
        if (req.accepts('html')) {
            return res.redirect('/auth/login');
        }
        // Для API запросов возвращаем JSON с ошибкой
        return res.status(403).json({message: 'Неверный формат заголовка Authorization'});
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        if (req.accepts('html')) {
            return res.redirect('/auth/login');
        }
        res.status(401).json({message: 'Неверный или истекший токен'});
    }
};
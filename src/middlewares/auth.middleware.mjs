// `src/middlewares/auth.middleware.mjs`
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'; // Добавляем импорт
import dotenv from 'dotenv';
dotenv.config();
// Примерный код в app.js или config.js
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET не определён. Проверьте файл .env');
  process.exit(1);
}

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).render('pug/auth/unauthorized', { title: 'Доступ запрещён' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ищем пользователя в базе данных по id из токена
    const AuthUser = mongoose.model('AuthUser');
    const user = await AuthUser.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).render('pug/auth/unauthorized', { title: 'Доступ запрещён' });
    }

    // Сохраняем полный объект пользователя, а не только данные из JWT
    req.user = user;
    next();
  } catch (err) {
    console.error('Ошибка аутентификации:', err.message);
    res.status(401).render('pug/auth/unauthorized', { title: 'Доступ запрещён' });
  }
};
// src/middlewares/auth.middleware.mjs
export const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;
  res.locals.isAuthenticated = false; // По умолчанию не авторизован

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Проверяем существование пользователя
      const AuthUser = mongoose.model('AuthUser');
      const user = await AuthUser.findOne({
        _id: decoded.id,
        token: token
      });

      if (user) {
        req.user = user;
        res.locals.user = {
          id: user._id,
          name: user.name,
          email: user.email
        };
        res.locals.isAuthenticated = true; // Устанавливаем флаг авторизации
      }
    } catch (err) {
      console.log('Ошибка проверки токена:', err.message);
    }
  }

  next();
};
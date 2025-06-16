// `src/middlewares/auth.middleware.mjs`
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('JWT_SECRET не определён. Проверьте файл .env');
    process.exit(1); // Завершение приложения, если секрет отсутствует
}

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).render('pug/auth/unauthorized', { title: 'Доступ запрещён' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).render('pug/auth/unauthorized', { title: 'Доступ запрещён' });
  }
};

export const checkAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      res.locals.isAuthenticated = true;
    } catch (err) {
      res.locals.isAuthenticated = false;
    }
  } else {
    res.locals.isAuthenticated = false;
  }

  next();
};
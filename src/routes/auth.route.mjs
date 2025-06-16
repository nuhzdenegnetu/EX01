// `src/routes/auth.routes.mjs`
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import AuthUser from '../models/authUser.model.mjs';
import bcrypt from 'bcrypt';
import { register, login, logout, renderLoginPage, renderRegisterPage } from '../controllers/auth.controller.mjs';

const router = express.Router();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Регистрация
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log('Получен запрос на регистрацию:', req.body);

    const existingUser = await AuthUser.findOne({ email });
    if (existingUser) {
      console.log('Email уже используется:', email);
      return res.status(400).json({ error: 'Email уже используется' });
    }

    console.log('Создание нового пользователя');
    const user = new AuthUser({ name, email, password });
    await user.save();

    console.log('Пользователь успешно сохранен:', user);

    if (!JWT_SECRET) {
      console.error('JWT_SECRET не определён');
      return res.status(500).json({ error: 'Ошибка сервера: JWT_SECRET отсутствует' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    user.token = token;

    try {
      await user.save();
      console.log('Токен успешно сохранён в базе данных:', user.token);
    } catch (err) {
      console.error('Ошибка при сохранении токена в базе данных:', err);
      return res.status(500).json({ error: 'Ошибка сервера при сохранении токена' });
    }

    res.cookie('token', token, { httpOnly: true, secure: true });
    res.status(201).json({ message: 'Пользователь зарегистрирован', redirectUrl: '/' });
  } catch (err) {
    if (err.code === 11000) {
      console.error('Ошибка дублирования:', err.keyValue);
      return res.status(400).json({ error: `Поле ${Object.keys(err.keyValue)[0]} уже используется` });
    }
    console.error('Ошибка при регистрации:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthUser.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Неверный email или пароль' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Неверный email или пароль' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }); // Убрано secure: true для локальной разработки
    res.status(201).json({ message: 'Вход выполнен!', redirectUrl: '/' });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Выход
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true });
  res.status(200).json({ message: 'Выход выполнен' });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true });
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Ошибка выхода');
    }
    res.redirect('/auth/login');
  });
});

// Показать страницу входа
router.get('/login', (req, res) => {
  res.render('pug/users/login', { title: 'Вход' });
});

// Показать страницу регистрации
router.get('/register', (req, res) => {
  res.render('pug/users/register', { title: 'Регистрация' });
});

router.get('/register', renderRegisterPage);
router.get('/login', renderLoginPage);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

export default router;
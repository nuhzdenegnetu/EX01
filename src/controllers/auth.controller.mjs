import AuthUser from '../models/authUser.model.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;// Замените на ваш секретный ключ

export const renderLoginPage = (req, res) => {
    res.render('pug/users/login', {title: 'Вход', isAuthenticated: !!req.cookies.token});
};

export const renderRegisterPage = (req, res) => {
    res.render('pug/users/register', {title: 'Регистрация', isAuthenticated: !!req.cookies.token});
};

export const register = async (req, res) => {
  const { name, password } = req.body;

  try {
    const existingUser = await AuthUser.findOne({ name });
    if (existingUser) {
      return res.status(400).render('pug/users/register', { title: 'Регистрация', error: 'Имя уже используется' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new AuthUser({ name, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.redirect('/'); // Перенаправление на главную страницу
  } catch (err) {
    res.status(500).render('pug/users/register', { title: 'Регистрация', error: 'Ошибка сервера' });
  }
};

export const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await AuthUser.findOne({ name });
    if (!user) {
      return res.status(400).render('pug/users/login', { title: 'Вход', error: 'Неверное имя или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('pug/users/login', { title: 'Вход', error: 'Неверное имя или пароль' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/'); // Перенаправление на главную страницу
  } catch (err) {
    res.status(500).render('pug/users/login', { title: 'Вход', error: 'Ошибка сервера' });
  }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};
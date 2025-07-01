import AuthUser from '../models/authUser.model.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const renderLoginPage = (req, res) => {
    res.render('pug/users/login', {title: 'Вход', isAuthenticated: !!req.cookies.token});
};

export const renderRegisterPage = (req, res) => {
    res.render('pug/users/register', {title: 'Регистрация', isAuthenticated: !!req.cookies.token});
};

export const register = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        console.log('Получен запрос на регистрацию:', req.body);

        // Базовая валидация
        const errors = {};

        if (!name || name.trim().length < 2) {
            errors.name = 'Имя должно содержать минимум 2 символа';
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Введите корректный email адрес';
        }

        if (!password || password.length < 6) {
            errors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (Object.keys(errors).length > 0) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(400).json({errors});
            } else {
                return res.status(400).render('pug/users/register', {
                    title: 'Регистрация',
                    errors,
                    values: {name, email}
                });
            }
        }

        const existingUser = await AuthUser.findOne({email});
        if (existingUser) {
            console.log('Email уже используется:', email);

            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(400).json({errors: {email: 'Email уже используется'}});
            } else {
                return res.status(400).render('pug/users/register', {
                    title: 'Регистрация',
                    errors: {email: 'Email уже используется'},
                    values: {name, email}
                });
            }
        }

        console.log('Создание нового пользователя');
        // Хешируем пароль перед сохранением
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new AuthUser({
            name,
            email,
            password: hashedPassword
        });

        // Создаем токен после сохранения
        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: '1h'});

        // Сохраняем токен в поле пользователя
        user.token = token;
        await user.save();

        console.log('Пользователь успешно сохранен:', user);

        // Устанавливаем cookie
        res.cookie('token', token, {httpOnly: true});

        // Возвращаем JSON при API запросе или redirect при обычном запросе
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(201).json({success: true, token, redirectUrl: '/'});
        } else {
            res.redirect('/');
        }
    } catch (err) {
        // Обработка ошибок
        console.error('Ошибка при регистрации:', err);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(500).json({errors: {server: 'Ошибка сервера'}});
        } else {
            res.status(500).render('pug/users/register', {
                title: 'Регистрация',
                errors: {server: 'Ошибка сервера'},
                values: {name, email}
            });
        }
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        // Базовая валидация
        const errors = {};

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Введите корректный email адрес';
        }

        if (!password) {
            errors.password = 'Введите пароль';
        }

        if (Object.keys(errors).length > 0) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(400).json({errors});
            } else {
                return res.status(400).render('pug/users/login', {
                    title: 'Вход',
                    errors,
                    values: {email}
                });
            }
        }

        const user = await AuthUser.findOne({email});
        if (!user) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(400).json({errors: {credentials: 'Неверный email или пароль'}});
            } else {
                return res.status(400).render('pug/users/login', {
                    title: 'Вход',
                    errors: {credentials: 'Неверный email или пароль'},
                    values: {email}
                });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(400).json({errors: {credentials: 'Неверный email или пароль'}});
            } else {
                return res.status(400).render('pug/users/login', {
                    title: 'Вход',
                    errors: {credentials: 'Неверный email или пароль'},
                    values: {email}
                });
            }
        }

        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: '1h'});

        // Сохраняем токен в БД
        user.token = token;
        await user.save();

        // Устанавливаем cookie
        res.cookie('token', token, {httpOnly: true});

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(200).json({success: true, token, redirectUrl: '/'});
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error('Ошибка при входе:', err);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(500).json({errors: {server: 'Ошибка сервера'}});
        } else {
            res.status(500).render('pug/users/login', {
                title: 'Вход',
                errors: {server: 'Ошибка сервера'},
                values: {email}
            });
        }
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {httpOnly: true});
    res.redirect('/auth/login');
};

export const apiLogout = (req, res) => {
    res.clearCookie('token', {httpOnly: true, secure: true});
    res.status(200).json({message: 'Выход выполнен'});
};
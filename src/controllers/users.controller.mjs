import FakeUser from '../models/fakeUser.model.mjs';
import AuthUser from '../models/authUser.model.mjs';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
    try {
        const users = await FakeUser.find({}, { userId: 1, name: 1, email: 1 }); // Явно запрашиваем userId
        res.render('pug/users/index', { title: 'Пользователи', users });
    } catch (err) {
        res.status(500).render('pug/users/index', { title: 'Пользователи', error: 'Ошибка загрузки пользователей' });
    }
};

export const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        // Проверяем, является ли userId числом
        if (isNaN(Number(userId))) {
            return res.status(400).render('pug/error', {
                title: 'Некорректный запрос',
                message: 'ID пользователя должен быть числом',
                statusCode: 400
            });
        }

        const user = await FakeUser.findOne({ userId: Number(userId) });

        // Явная проверка на null/undefined
        if (!user) {
            return res.status(404).render('pug/error', {
                title: 'Пользователь не найден',
                message: 'Запрашиваемый пользователь не существует',
                statusCode: 404
            });
        }

        res.render('pug/users/user', { title: 'Пользователь', user });
    } catch (err) {
        console.error('Ошибка при поиске пользователя:', err);
        res.status(500).render('pug/error', {
            title: 'Ошибка сервера',
            message: 'Произошла ошибка при загрузке профиля пользователя',
            statusCode: 500
        });
    }
};

// Создание пользователя
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверяем существование пользователя
        const existingUser = await AuthUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const newUser = new AuthUser({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'Пользователь успешно создан',
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании пользователя' });
    }
};

// Обновление пользователя
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, password } = req.body;

        const user = await AuthUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Обновляем поля, если они предоставлены
        if (name) user.name = name;
        if (email) user.email = email;

        // Если был передан новый пароль, хешируем его
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            message: 'Информация о пользователе обновлена',
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении пользователя' });
    }
};

// Удаление пользователя
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await AuthUser.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
    }
};
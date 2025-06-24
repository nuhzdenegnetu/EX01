import FakeUser from '../models/fakeUser.model.mjs';

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
        const user = await FakeUser.findOne({ userId }); // Ищем по строке
        if (!user) {
            return res.status(404).render('pug/users/user', { title: 'Пользователь', error: 'Пользователь не найден' });
        }
        res.render('pug/users/user', { title: 'Пользователь', user });
    } catch (err) {
        res.status(500).render('pug/users/user', { title: 'Пользователь', error: 'Ошибка загрузки профиля пользователя' });
    }
};
import FakeUser from '../models/fakeUser.model.mjs';

export const getUsers = async (req, res) => {
    try {
        const users = await FakeUser.find();
        res.render('pug/users/index', { title: 'Пользователи', users });
    } catch (err) {
        res.status(500).render('pug/users/index', { title: 'Пользователи', error: 'Ошибка загрузки пользователей' });
    }
};
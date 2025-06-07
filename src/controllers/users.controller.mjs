export const getUsers = (req, res) => {
    // В реальном приложении данные будут получены из БД
    const users = [
        {id: 1, name: 'Иван', email: 'ivan@example.com'},
        {id: 2, name: 'Мария', email: 'maria@example.com'},
        {id: 3, name: 'Алексей', email: 'alex@example.com'}
    ];

    res.render('pug/users/index.pug', {
        title: 'Список пользователей',
        users
    });
};

export const getUserById = (req, res) => {
    const userId = parseInt(req.params.userId);

    // В реальном приложении данные будут получены из БД
    const user = {
        id: userId,
        name: `Пользователь ${userId}`,
        email: `user${userId}@example.com`,
        bio: 'Описание пользователя'
    };

    res.render('pug/users/user.pug', {
        title: `Пользователь ${user.name}`,
        user
    });
};
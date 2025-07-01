// src/controllers/index.controller.mjs
export const getHomePage = (req, res) => {
  res.render('pug/index', {
    title: 'Главная страница - Express App',
    user: req.user // Передаем пользователя в шаблон
  });
};
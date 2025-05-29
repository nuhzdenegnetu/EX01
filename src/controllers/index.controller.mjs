export const getHomePage = (req, res) => {
  res.render('pug/index', {
    title: 'Главная страница - Express App'
  });
};
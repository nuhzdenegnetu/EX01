export const getArticles = (req, res) => {
    // В реальном приложении данные будут получены из БД
    const articles = [
        { id: 1, title: 'Введение в Express', author: 'Иван', summary: 'Основы работы с Express.js' },
        { id: 2, title: 'Шаблонизаторы в Node.js', author: 'Мария', summary: 'Сравнение популярных шаблонизаторов' },
        { id: 3, title: 'REST API с Express', author: 'Алексей', summary: 'Создание RESTful API' }
    ];

    res.render('ejs/articles/index.ejs', {
        title: 'Список статей',
        articles
    });
};

export const getArticleById = (req, res) => {
    const articleId = parseInt(req.params.articleId);

    // В реальном приложении данные будут получены из БД
    const article = {
        id: articleId,
        title: `Статья ${articleId}`,
        author: 'Автор',
        content: 'Содержание статьи. Много интересного текста о технологиях.',
        publishedDate: new Date().toLocaleDateString()
    };

    res.render('ejs/articles/article.ejs', {
        title: article.title,
        article
    });
};
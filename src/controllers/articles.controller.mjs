import Article from '../models/article.model.mjs';
import slugify from 'slugify';

// Получение списка статей из базы данных
export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find({published: true})
            .sort({publishedAt: -1}) // Сортировка по дате публикации (новые сначала)
            .limit(10); // Ограничиваем количество статей для вывода

        res.render('ejs/articles/index', {
            title: 'Список статей',
            articles: articles.map(article => ({
                id: article._id,
                title: article.title,
                author: article.authorName,
                summary: article.summary || article.content.substring(0, 150) + '...'
            }))
        });
    } catch (error) {
        console.error('Ошибка при получении статей:', error);
        res.status(500).render('ejs/error.ejs', {
            message: 'Не удалось загрузить список статей'
        });
    }
};

// Получение одной статьи по ID
export const getArticleById = async (req, res) => {
    try {
        const articleId = req.params.articleId;

        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).render('ejs/error.ejs', {
                message: 'Статья не найдена'
            });
        }

        // Увеличиваем счетчик просмотров
        article.viewCount += 1;
        await article.save();

        // Форматируем дату публикации
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        res.render('ejs/articles/article', {
            title: article.title,
            article: {
                id: article._id,
                title: article.title,
                author: article.authorName,
                content: article.content,
                publishedDate: publishedDate,
                readingTime: article.readingTime,
                viewCount: article.viewCount,
                tags: article.tags
            }
        });
    } catch (error) {
        console.error('Ошибка при получении статьи:', error);
        res.status(500).render('ejs/error.ejs', {
            message: 'Не удалось загрузить статью'
        });
    }
};

export const createArticle = async (req, res) => {
    try {
        const {title, content, summary, category, tags} = req.body;

        if (!title || !content) {
            return res.status(400).json({message: 'Заголовок и содержание обязательны'});
        }

        const slug = slugify(title, {
            lower: true,
            strict: true,
            locale: 'ru'
        });

        const article = new Article({
            title,
            slug,
            content,
            summary: summary || title,
            author: req.user._id,
            authorName: req.user.name,
            category: category || 'Другое',
            tags: tags || [],
            publishedAt: new Date()
        });

        await article.save();

        res.status(201).json({
            message: 'Статья успешно создана',
            article: {
                id: article._id,
                title: article.title,
                slug: article.slug
            }
        });
    } catch (error) {
        console.error('Ошибка при создании статьи:', error);
        res.status(500).json({message: 'Ошибка при создании статьи', error: error.message});
    }
};

// Обновление статьи
export const updateArticle = async (req, res) => {
    try {
        const {title, content, summary, category, tags, published} = req.body;
        const articleId = req.params.articleId;

        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({message: 'Статья не найдена'});
        }

        // Обновляем поля только если они были переданы
        if (title) {
            article.title = title;
            article.slug = slugify(title, {
                lower: true,
                strict: true,
                locale: 'ru'
            });
        }

        if (content) article.content = content;
        if (summary) article.summary = summary;
        if (category) article.category = category;
        if (tags) article.tags = tags;
        if (published !== undefined) article.published = published;

        article.updatedAt = new Date();

        await article.save();

        res.status(200).json({
            message: 'Статья успешно обновлена',
            article: {
                id: article._id,
                title: article.title,
                slug: article.slug
            }
        });
    } catch (error) {
        console.error('Ошибка при обновлении статьи:', error);
        res.status(500).json({message: 'Не удалось обновить статью', error: error.message});
    }
};

// Удаление статьи
export const deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.articleId;

        const result = await Article.findByIdAndDelete(articleId);

        if (!result) {
            return res.status(404).json({message: 'Статья не найдена'});
        }

        res.status(200).json({message: 'Статья успешно удалена'});
    } catch (error) {
        console.error('Ошибка при удалении статьи:', error);
        res.status(500).json({message: 'Не удалось удалить статью', error: error.message});
    }
};

// controllers/articles.controller.mjs
export const getArticlesPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Создаем курсор для обработки большого количества документов
        const cursor = Article.find({ published: true })
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .cursor();

        const articles = [];
        let article;

        // Читаем документы по одному с помощью курсора
        while ((article = await cursor.next())) {
            articles.push({
                id: article._id,
                title: article.title,
                author: article.authorName,
                summary: article.summary || article.content.substring(0, 150) + '...',
                publishedAt: article.publishedAt
            });
        }

        // Получаем общее количество статей для пагинации
        const totalArticles = await Article.countDocuments({ published: true });
        const totalPages = Math.ceil(totalArticles / limit);

        res.render('ejs/articles/paginated', {
            title: 'Список статей с пагинацией', // Добавляем title
            articles,
            pagination: {
                page,
                limit,
                totalPages
            }
        });
    } catch (error) {
        console.error('Ошибка при получении статей:', error);
        res.status(500).render('ejs/error.ejs', {
            title: 'Ошибка', // Добавляем title и здесь
            message: 'Не удалось загрузить список статей'
        });
    }
};

export const getArticlesStats = async (req, res) => {
    try {
        // Используем агрегационный запрос для получения статистики
        console.log('Выполняется getArticlesStats');
        const stats = await Article.aggregate([
            {$match: {published: true}}, // Только опубликованные статьи
            {
                $group: {
                    _id: null,
                    totalArticles: {$sum: 1},
                    totalViews: {$sum: "$viewCount"},
                    averageViews: {$avg: "$viewCount"},
                    mostViewedArticle: {$max: "$viewCount"},
                    categoriesCount: {$addToSet: "$category"}, // Уникальные категории
                    avgReadingTime: {$avg: "$readingTime"}
                }
            },
            {
                $project: {
                    _id: 0,
                    totalArticles: 1,
                    totalViews: 1,
                    averageViews: {$round: ["$averageViews", 2]},
                    mostViewedArticle: 1,
                    categoriesCount: {$size: "$categoriesCount"},
                    avgReadingTime: {$round: ["$avgReadingTime", 1]}
                }
            }
        ]);

        // Получаем статистику по категориям
        const categoryStats = await Article.aggregate([
            {$match: {published: true}},
            {
                $group: {
                    _id: "$category",
                    count: {$sum: 1},
                    totalViews: {$sum: "$viewCount"},
                    avgViews: {$avg: "$viewCount"}
                }
            },
            {$sort: {count: -1}},
            {
                $project: {
                    category: "$_id",
                    _id: 0,
                    count: 1,
                    totalViews: 1,
                    avgViews: {$round: ["$avgViews", 2]}
                }
            }
        ]);

        // Статистика по тегам
        const tagStats = await Article.aggregate([
            {$match: {published: true}},
            {$unwind: "$tags"}, // Разворачиваем массив тегов
            {
                $group: {
                    _id: "$tags",
                    count: {$sum: 1}
                }
            },
            {$sort: {count: -1}},
            {$limit: 10}, // Топ-10 тегов
            {
                $project: {
                    tag: "$_id",
                    _id: 0,
                    count: 1
                }
            }
        ]);
        console.log('Рендеринг шаблона ejs/articles/stats');
        res.render('ejs/articles/stats', {
            title: 'Статистика статей',
            generalStats: stats[0] || {},
            categoryStats,
            tagStats
        });
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        res.status(500).render('ejs/error.ejs', {
            message: 'Не удалось загрузить статистику статей'
        });
    }
};
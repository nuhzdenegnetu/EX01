import mongoose from 'mongoose';
import {fakerRU} from '@faker-js/faker';
import slugify from 'slugify';
import dotenv from 'dotenv';
import Article from '../models/article.model.mjs';
import connectDB from '../config/db.mjs';
import AuthUser from '../models/authUser.model.mjs';

dotenv.config();

const generateParagraph = () => {
    return fakerRU.lorem.paragraph(fakerRU.number.int({min: 3, max: 10}));
};

const generateContent = () => {
    const paragraphs = fakerRU.number.int({min: 3, max: 8});
    return Array.from({length: paragraphs}, generateParagraph).join('\n\n');
};

const categories = [
    'Технологии', 'Разработка', 'JavaScript', 'Node.js',
    'База данных', 'Фронтенд', 'Бэкенд', 'DevOps',
    'Искусственный интеллект', 'Мобильная разработка'
];

const generateTags = () => {
    const tags = new Set();
    const tagsCount = fakerRU.number.int({min: 1, max: 5});

    while (tags.size < tagsCount) {
        tags.add(fakerRU.word.words(1));
    }

    return Array.from(tags);
};

const generateSlug = (title) => {
    return slugify(title, {
        lower: true,
        strict: true,
        locale: 'ru'
    });
};

// Добавим немного знаменитых авторов для случая, когда пользователей нет в базе
const fakeAuthors = [
    'Джон Резиг', 'Эдди Османи', 'Брендан Эйх', 'Райан Даль',
    'Мартин Фаулер', 'Дуглас Крокфорд', 'Лиза Геки', 'Адди Османи',
    'Элис Купер', 'Евгений Степанов', 'Мария Иванова', 'Антон Веб'
];

const generateArticles = async (count = 20) => {
    try {
        await connectDB();

        console.log('Получение списка пользователей...');
        let users = await AuthUser.find({});

        // Если пользователей нет, продолжаем работу с фейковыми авторами
        if (!users.length) {
            console.log('Пользователи не найдены, используем фиктивных авторов');
            users = null;
        } else {
            console.log(`Найдено ${users.length} пользователей.`);
        }

        // Удаляем существующие статьи (опционально)
        console.log('Очистка коллекции статей...');
        await Article.deleteMany({});

        console.log(`Генерация ${count} статей...`);

        const articles = [];

        for (let i = 0; i < count; i++) {
            const title = fakerRU.lorem.sentence().replace('.', '');

            // Если есть пользователи, берем случайного, иначе используем фиктивного автора
            const user = users ? users[Math.floor(Math.random() * users.length)] : null;
            const authorName = user ? user.name :
                fakeAuthors[Math.floor(Math.random() * fakeAuthors.length)];

            const article = {
                title,
                slug: generateSlug(title),
                content: generateContent(),
                summary: fakerRU.lorem.paragraph(),
                author: user ? user._id : undefined,
                authorName: authorName,
                category: categories[Math.floor(Math.random() * categories.length)],
                tags: generateTags(),
                published: fakerRU.datatype.boolean(0.8),
                publishedAt: fakerRU.date.past({years: 1}),
                updatedAt: fakerRU.date.recent({days: 30}),
                readingTime: fakerRU.number.int({min: 3, max: 15}) + ' мин',
                viewCount: fakerRU.number.int({min: 0, max: 1000}),
            };

            articles.push(article);

            // Показываем прогресс
            if ((i + 1) % 5 === 0) {
                console.log(`Сгенерировано ${i + 1} статей...`);
            }
        }

        // Сохраняем все статьи в базу данных
        console.log('Сохранение статей в базу данных...');
        await Article.insertMany(articles);

        console.log(`Успешно добавлено ${count} статей в базу данных`);

        process.exit(0);
    } catch (error) {
        console.error('Ошибка при генерации статей:', error);
        process.exit(1);
    }
};

const count = process.argv[2] ? parseInt(process.argv[2]) : 20;
generateArticles(count);